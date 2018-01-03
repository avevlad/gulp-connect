var request = require('supertest');
var connect = require('../index');
require('mocha');

var portCounter = 35000;
describe('gulp-connect', function () {
  describe('Simple', function() {
    var req;
    var port;
    after(function() {
      connect.serverClose();
    })
    it('Explicit /test.txt', function (done) {
      var port = portCounter++;
      connect.server({
        port: port
      }, function() {
        request('http://localhost:' + port)
          .get('/fixtures/simplest/test.txt')
          .expect(/Hello world/)
          .expect(200)
          .end(function (err, res) {
            done(err);
          });
      });
    })
    it('Implicit /index.html', function (done) {
      var port = portCounter++;
      connect.server({
        port: port
      }, function() {
        request('http://localhost:' + port)
          .get('/fixtures/simplest/')
          .expect(/index page/)
          .expect(200)
          .end(function (err, res) {
            done(err);
          });
      });
    })
  })
})
describe('Self Start / Stop', function() {
  after(function() {
    connect.serverClose();
  })
  it('Root string', function (done) {
    var port = portCounter++;
    connect.server({
      port: port,
      root: __dirname + "/fixtures"
    });
    request('http://localhost:' + port)
      .get('/multiple/app/index.html')
      .expect(/app test/)
      .end(function (err, res) {
        connect.serverClose();
        if (err) return done(err);
        done()
      });
  })
  it('Root array', function (done) {
    var port = portCounter++;
    connect.server({
      port: port,
      root: [__dirname + "/fixtures/multiple/app", __dirname + "/fixtures/multiple/dist"]
    });
    request('http://localhost:' + port)
      .get('/index.html')
      .expect(/app test/)
      .expect(200)
      .end(function (err) {
        if (err) return done(err);
      });
    request('http://localhost:' + port)
      .get('/dist.html')
      .expect(/dist test/)
      .expect(200)
      .end(function (err) {
        connect.serverClose();
        if (err) return done(err);
        done()
      });
  })
  it('Port test', function (done) {
    connect.server({
      root: __dirname + "/fixtures/multiple/app",
      port: 3333
    });
    request('http://localhost:3333')
      .get('/index.html')
      .expect(/app test/)
      .end(function (err) {
        connect.serverClose();
        if (err) return done(err);
        done()
      });
  })
  it('Https test', function (done) {
    //suppress invalid self-signed ssl certificate error
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
    var port = portCounter++;
    connect.server({
      port: port,
      root: __dirname + "/fixtures/multiple/app",
      https: true
    });
    request('https://localhost:' + port)
      .get('/index.html')
      .expect(/app test/)
      .end(function (err) {
        connect.serverClose();
        if (err) return done(err);
        done()
      });
  })
  it('Livereload test', function (done) {
    var port = portCounter++;
    connect.server({
      port: port,
      livereload: true
    }, function() {
      request('http://localhost:35729')
        .get('/')
        .expect('Content-Type', /json/)
        .end(function (err) {
          if (err) return done(err);
          request('http://localhost:35729')
            .get('/livereload.js')
            .expect(200)
            .end(function (err) {
              connect.serverClose();
              if (err) return done(err);
              done();
            });
        });
    });
  })
  it('Livereload https test', function (done) {
    var port = portCounter++;
    connect.server({
      port: port,
      livereload: true,
      https: true
    }, function() {
      request('https://localhost:35729')
        .get('/')
        .expect('Content-Type', /json/)
        .end(function (err) {
          if (err) return done(err);
          request('https://localhost:35729')
            .get('/livereload.js')
            .expect(200)
            .end(function (err) {
              connect.serverClose();
              if (err) return done(err);
              done();
            });
        });
    });
  })
  it('Livereload port', function (done) {
    var port = portCounter++;
    var liveReloadPort = portCounter++;
    connect.server({
      port: port,
      livereload: {
        port: liveReloadPort
      }
    },
    function() {
      request('http://localhost:' + liveReloadPort)
        .get('/')
        .expect('Content-Type', /json/)
        .end(function (err) {
          connect.serverClose();
          if (err) return done(err);
          done();
        });
    });
  })
  it('livereload closes', function (done) {
    this.timeout(10000);
    var port = portCounter++;
    var liveReloadPort = portCounter++;
    connect.server({
      port: port,
      livereload: {
        port: liveReloadPort
      }
    },
    function() {
      request('http://localhost:' + liveReloadPort)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          connect.serverClose();
          setTimeout(function() {
              request('http://localhost:' + liveReloadPort)
                .get('/')
                .end(function (err) {
                  if (err) return done();
                  done(new Error("Live reload is still running."));
              })}, 100);
        })
    });
  })
  it('Fallback test', function (done) {
    var port = portCounter++;
    connect.server({
      port: port,
      fallback: __dirname + '/fixtures/simplest/index.html'
    }, function() {
      request('http://localhost:' + port)
        .get('/not/existing/path')
        .expect(/index page/)
        .expect('Content-Type', new RegExp('text/html; charset=UTF-8'))
        .expect(200)
        .end(function (err, res) {
          connect.serverClose();
          if (err) return done(err);
          done()
        });
    });
  })
})
