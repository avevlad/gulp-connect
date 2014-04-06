var request = require('supertest');
var connect = require('../index');

describe('gulp-connect', function () {
  it('Simple test', function (done) {
    connect.server();
    request('http://localhost:8080')
      .get('/fixtures/simplest/test.txt')
      .expect(/Hello world/)
      .expect(200)
      .end(function (err, res) {
        connect.serverClose();
        if (err) return done(err);
        done()
      });
  })
})