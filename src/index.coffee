path = require("path")
es = require("event-stream")
util = require("gulp-util")
http = require("http")
connect = require("connect")
liveReload = require("connect-livereload")
tiny_lr = require("tiny-lr")
opt = {}
server = undefined
lr = undefined

class ConnectApp
  constructor: (options) ->
    opt = options
    opt.port = opt.port || "8080"
    opt.root = opt.root || path.dirname(module.parent.id)
    opt.host = opt.host || "localhost"
    @oldMethod("open") if opt.open
    @server()

  server: ->
    middleware = @middleware()
    app = connect.apply(null, middleware)
    server = http.createServer(app)
    app.use connect.directory(if typeof opt.root == "object" then opt.root[0] else opt.root)
    server.listen opt.port
    @log "Server started http://#{opt.host}:#{opt.port}"
    if opt.livereload
      tiny_lr.Server::error = ->
      lr = tiny_lr()
      lr.listen opt.livereload.port
      @log "LiveReload started on port #{opt.livereload.port}"

  middleware: ->
    middleware = if opt.middleware then opt.middleware.call(this, connect, opt) else []
    if opt.livereload
      opt.livereload = {}  if typeof opt.livereload is "boolean"
      opt.livereload.port = 35729  unless opt.livereload.port
      middleware.push liveReload(port: opt.livereload.port)
    if typeof opt.root == "object"
      opt.root.forEach (path) ->
        middleware.push connect.static(path)
    else
      middleware.push connect.static(opt.root)
    return middleware

  log: (@text) ->
    util.log util.colors.green(@text)

  logWarning: (@text) ->
    util.log util.colors.yellow(@text)

  oldMethod: (type) ->
    text = 'does not work in gulp-connect v 2.*. Please read "readme" https://github.com/AveVlad/gulp-connect'
    switch type
      when "open" then @logWarning("Option open #{text}")

module.exports =
  server: (options = {}) -> new ConnectApp(options)
  reload: ->
    es.map (file, callback) ->
      if opt.livereload and typeof lr == "object"
        lr.changed body:
          files: file.path
      callback null, file
  serverClose: -> do server.close
