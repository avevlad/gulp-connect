var fs = require('fs');
var util = require('gulp-util');
var http = require('http');
var open = require('open');
var connect = require('connect');
var liveReload = require('connect-livereload');
var tiny_lr = require('tiny-lr');
var lr;

module.exports = {
  server: function (o) {
    o = o || {};
    if (!o.root) o.root = 'app';
    if (!o.port) o.port = 3000;
    if (!o.livereload) o.livereload = false;
    if (o.open) {
      if (typeof o.open == 'boolean') o.open = {};
      if (!o.open.file) o.open.file = 'index.html';
      if (!o.open.browser) o.open.browser = 'chrome';
    }
    if (o.livereload) {
      if (typeof o.livereload == 'boolean') o.livereload = {};
      if (!o.livereload.port) o.livereload.port = 35729;
    }
    if (!fs.existsSync(o.root)) {
      util.log(util.colors.red('Folder ' + o.root + ' does not exist!'));
      return false;
    }

    return function () {
      var middleware = [];
      if (o.livereload) {
        lr = tiny_lr();
        lr.listen(o.livereload.port);
        middleware.push(liveReload({port: o.livereload.port}));
        util.log(util.colors.green('Connect LiveReload on ' + o.livereload.port + ' port'));
      }
      middleware.push(connect["static"](o.root));
      var app = connect.apply(null, middleware);
      var server = http.createServer(app);
      server
        .listen(o.port, function () {
          util.log(util.colors.green('Server started on ' + o.port + ' port'));
          if (o.open) {
            open('http://localhost:' + o.port + '/' + o.open.file, o.open.browser);
            util.log(util.colors.green('Opened ' + o.open.file + ' in ' + o.open.browser));
          }
        })
    };
  },
  reload: function (event) {
    lr.changed({
      body: {
        files: event.path
      }
    });
  }
};
