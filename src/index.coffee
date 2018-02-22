path = require("path")
fancyLog = require("fancy-log")
colors = require("ansi-colors")
es = require("event-stream")
http = require("http")
https = require("https")
fs = require("fs")
connect = require("connect")
serveStatic = require('serve-static')
serveIndex = require('serve-index')
liveReload = require("connect-livereload")
send = require("send")
tiny_lr = require("tiny-lr")
apps = []

class ConnectApp
  constructor: (options, startedCallback) ->
    @name = options.name || "Server"
    @port = options.port || "8080"
    @root = options.root || path.dirname(module.parent.id)
    @host = options.host || "localhost"
    @debug = options.debug || false
    @silent = options.silent || false
    @https = options.https || false
    @preferHttp1 = options.preferHttp1 || false;
    @livereload = options.livereload || false
    @middleware = options.middleware || undefined
    @startedCallback = startedCallback || () -> {};
    @serverInit = options.serverInit || undefined
    @fallback = options.fallback || undefined
    @index =  options.index
    @oldMethod("open") if options.open
    @sockets = []
    @app = undefined
    @lr = undefined
    @state = "initializing"
    @run()

  run: ->
    if @state == "stopped"
      return

    @state = "starting"
    @log "Starting server..."
    @app = connect()

    @handlers().forEach (middleware) =>
      if typeof (middleware) is "object"
        @app.use middleware[0], middleware[1]
      else
        @app.use middleware

    @app.use serveIndex(if typeof @root == "object" then @root[0] else @root)

    if @https

      # use some defaults when not set. do not touch when a key is already specified
      # see https://github.com/AveVlad/gulp-connect/issues/172
      if typeof (@https) is 'boolean' || !@https.key

        # change it into an object if it is not already one
        if !(typeof (@https) is "object")
          @https = {}

        @https.key        = fs.readFileSync __dirname + '/certs/server.key'
        @https.cert       = fs.readFileSync __dirname + '/certs/server.crt'
        @https.ca         = fs.readFileSync __dirname + '/certs/server.crt'
        @https.passphrase = 'gulp'

      http2 = undefined
      if !@preferHttp1
        try
          http2 = require('http2')

      if http2
        @https.allowHTTP1 = true
        @server = http2.createSecureServer(@https, @app)
      else
        @server = https.createServer(@https, @app)

    else
      @server = http.createServer @app
    if @serverInit
      @serverInit @server
    @server.listen @port, @host, (err) =>
      if err
        @log "Error on starting server: #{err}"
      else
        @log "#{@name} started http#{if @https then 's' else ''}://#{@host}:#{@port}"

        stoped = false
        sockets = []

        @server.on "close", =>
          if (!stoped)
            stoped = true
            @log "#{@name} stopped"

        # Log connections and request in debug
        @server.on "connection", (socket) =>
          @logDebug "Received incoming connection from #{socket.address().address}"
          @sockets.push socket
          socket.on "close", =>
           @sockets.splice @sockets.indexOf(socket), 1

        @server.on "request", (request, response) =>
          @logDebug "Received request #{request.method} #{request.url}"

        @server.on "error", (err) =>
          @log err.toString()

        stopServer = =>
          if (!stoped)
            @sockets.forEach (socket) =>
              socket.destroy()

            @server.close()
            if @livereload
              @lr.close()
            process.nextTick( ->
              process.exit(0)
            )

        process.on("SIGINT", stopServer)
        process.on("exit", stopServer)

        if @livereload
          tiny_lr.Server::error = ->
          if @https
            @lr = tiny_lr
              key: @https.key || fs.readFileSync __dirname + '/certs/server.key'
              cert: @https.cert || fs.readFileSync __dirname + '/certs/server.crt'
          else
            @lr = tiny_lr()

          @lr.listen @livereload.port
          @log "LiveReload started on port #{@livereload.port}"
        @state = "running";
        @log "Running server"
        @startedCallback()

  close: ->
    if @state == "running"
      @log "Stopping server"
      if @livereload
        @lr.close()
      @server.close()
      @state = "stopped"
      @log "Stopped server"
    else if @state == "stopped"
      @log "Server has already been stopped."
    else
      @log "Ignoring stop as server is in " + @state + " state."

  handlers: ->
    steps = if @middleware then @middleware.call(this, connect, @) else []
    if @livereload
      @livereload = {}  if typeof @livereload is "boolean"
      @livereload.port = 35729  unless @livereload.port
      steps.unshift liveReload(@livereload)
    if @index is true then @index = "index.html"
    if typeof @root == "object"
      @root.forEach (path) ->
        steps.push serveStatic(path, {index: @index})
    else
      steps.push serveStatic(@root, {index: @index})
    if @fallback
      steps.push (req, res) =>
        fallbackPath = @fallback

        if typeof @fallback is "function"
          fallbackPath = @fallback(req, res)

        send(req, fallbackPath).pipe(res);

    return steps

  log: (text) ->
    if !@silent
      fancyLog colors.green(text)

  logWarning: (text) ->
    if !@silent
      fancyLog colors.yellow(text)

  logDebug: (text) ->
    if @debug
      fancyLog colors.blue(text)

  oldMethod: (type) ->
    text = 'does not work in gulp-connect v 2.*. Please read "readme" https://github.com/AveVlad/gulp-connect'
    switch type
      when "open" then @logWarning("Option open #{text}")

module.exports =
  server: (options = {}, startedCallback = null) ->
    app = new ConnectApp(options, startedCallback)
    apps.push(app)
    app
  reload: ->
    es.map (file, callback) ->
      apps.forEach (app) =>
        if app.livereload and typeof app.lr == "object"
          app.lr.changed body:
            files: file.path
      callback null, file
  serverClose: ->
    apps.forEach((app) -> do app.close)
    apps = []
