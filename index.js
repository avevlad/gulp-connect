var es = require('event-stream');
var fs = require('fs');
var util = require('gulp-util');
var http = require('http');
var open = require('open');
var connect = require('connect');
var liveReload = require('connect-livereload');
var tiny_lr = require('tiny-lr');
var lr;
var o = {};

module.exports = {
  server: function (opt) {
    o = opt || {};
    o.root = o.root || ['app'];
    o.host = o.host || 'localhost';
    o.port = o.port || 3000;
    o.livereload = typeof o.livereload === 'boolean' ? o.livereload : (o.livereload || true);
    if (o.open) {
      if (typeof o.open === 'boolean') o.open = {};
      if (!o.open.file) o.open.file = '';
      if (!o.open.browser) o.open.browser = undefined;
    }

    return function () {
      var middleware = o.middleware ? o.middleware.call(this, connect, o) : [];
      if (o.livereload) {
        if (typeof o.livereload == 'boolean') o.livereload = {};
        if (!o.livereload.port) o.livereload.port = 35729;
        middleware.push(liveReload({port: o.livereload.port}));
        util.log(util.colors.green('Connect LiveReload on ' + o.livereload.port + ' port'));
      }
      o.root.forEach(function (path) {
        middleware.push(connect.static(path));
      });
      var app = connect.apply(null, middleware);
      var server = http.createServer(app);
      if (o.root.length) app.use(connect.directory(o.root[0]));
      server
        .listen(o.port)
        .on('listening', function () {
          if (o.livereload) {
            lr = tiny_lr();
            lr.listen(o.livereload.port);
          }
          var url, browsername;
          util.log(util.colors.green('Server started on ' + o.port + ' port'));
          if (o.open) {
            url = 'http://' + o.host + (o.port === 80 ? '' : ':' + o.port) + '/';
            if (o.open.file) {
              url += o.open.file;
            }
            if (o.open.browser) browsername = o.open.browser;
            else browsername = 'default browser';
            open(url, o.open.browser, function (error) {
              if (error) util.log(util.colors.red(error));
              else util.log(util.colors.green('Opened ' + url + ' in ' + browsername));
            });
          }
        })
    };
  },
  reload: function () {
    return es.map(function (file, callback) {
      if (o.livereload && typeof lr == "object") {
        lr.changed({
          body: {
            files: file.path
          }
        });
      }
      callback(null, file);
    });
  }
};
