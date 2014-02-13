var es = require('event-stream');
var fs = require('fs');
var util = require('gulp-util');
var http = require('http');
var open = require('open');
var connect = require('connect');
var liveReload = require('connect-livereload');
var tiny_lr = require('tiny-lr');
var lr;
var opt;

module.exports = {
  server: function (o) {
    o = o || {};
    opt = o;
    if (!o.root) o.root = ['app'];
    if (!o.port) o.port = 3000;
    if (!o.livereload) o.livereload = false;
    if (o.open) {
      if (typeof o.open == 'boolean') o.open = {};
      if (!o.open.file) o.open.file = '';
      if (!o.open.browser) o.open.browser = undefined;
    }
    if (o.livereload) {
      if (typeof o.livereload == 'boolean') o.livereload = {};
      if (!o.livereload.port) o.livereload.port = 35729;
      lr = tiny_lr();
      lr.listen(o.livereload.port);
    }
    return function () {
      var middleware = o.middleware ? o.middleware.call(this, connect, o) : [];
      if (o.livereload) {
        middleware.push(liveReload({port: o.livereload.port}));
        util.log(util.colors.green('Connect LiveReload on ' + o.livereload.port + ' port'));
      }
      o.root.forEach(function (path) {
        middleware.push(connect.static(path));
      });
      var app = connect.apply(null, middleware);
      var server = http.createServer(app);
      server
        .listen(o.port)
        .on('listening', function () {
          var url, browsername;
          util.log(util.colors.green('Server started on ' + o.port + ' port'));
          if (o.open) {
            url = 'http://localhost:' + o.port + '/' + o.open.file;
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
      if (opt.livereload) {
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
