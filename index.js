var es = require('event-stream');
var fs = require('fs');
var util = require('gulp-util');
var http = require('http');
var open = require('open');
var connect = require('connect');
var liveReload = require('connect-livereload');
var tiny_lr = require('tiny-lr');
var lr;

function Server() {
  this.o = {};
  this.server = function (opt) {
    var s = this;
    s.o = opt || {};
    s.o.root = s.o.root || ['app'];
    s.o.port = s.o.port || 3000;
    s.o.livereload = typeof s.o.livereload === 'boolean' ? s.o.livereload : (s.o.livereload || true);
    s.o.open = s.o.open || {};
    if (!s.o.open.file) s.o.open.file = '';
    if (!s.o.open.browser) s.o.open.browser = undefined;

    return function () {
      var middleware = s.o.middleware ? s.o.middleware.call(s, connect, s.o) : [];
      if (s.o.livereload) {
        if (typeof s.o.livereload == 'boolean') s.o.livereload = {};
        if (!s.o.livereload.port) s.o.livereload.port = 35729;
        middleware.push(liveReload({port: s.o.livereload.port}));
        util.log(util.colors.green('Connect LiveReload on ' + s.o.livereload.port + ' port'));
      }
      s.o.root.forEach(function (path) {
        middleware.push(connect.static(path));
      });
      var app = connect.apply(null, middleware);
      var server = http.createServer(app);
      if (s.o.root.length) app.use(connect.directory(s.o.root[0]));
      server
        .listen(s.o.port)
        .on('listening', function () {
          if (s.o.livereload) {
            lr = tiny_lr();
            lr.listen(s.o.livereload.port);
          }
          var url, browsername;
          util.log(util.colors.green('Server started on ' + s.o.port + ' port'));
          if (s.o.open) {
            url = 'http://localhost:' + s.o.port + '/' + s.o.open.file;
            if (s.o.open.browser) browsername = s.o.open.browser;
            else browsername = 'default browser';
            open(url, s.o.open.browser, function (error) {
              if (error) util.log(util.colors.red(error));
              else util.log(util.colors.green('Opened ' + url + ' in ' + browsername));
            });
          }
        })
    };
  },
  this.reload = function () {
    var s = this;
    return es.map(function (file, callback) {
      if (s.o.livereload && typeof lr == "object") {
        lr.changed({
          body: {
            files: file.path
          }
        });
      } else {
        util.log(util.colors.bgRed('call connect.reload(), livereload is false, enable livereload'));
      }
      callback(null, file);
    });
  }
}

module.exports = function (config) {
  var s = new Server();
  if(config) {
    s.server(config);
  }
  return s;
}
