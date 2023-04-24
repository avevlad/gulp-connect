import { describe, it } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import connect from '../index.js';

var portCounter = 35000;

describe('Simple', async () => {

  it('is a subtest', () => {
    var port = portCounter++;
    connect.server({
      port: port
    }, function () {
      request('http://localhost:' + port)
        .get('/fixtures/simplest/test.txt')
        .expect(/Hello world/)
        .expect(200)
        .end(function (err, res) {
          done(err);
        });
    });
    assert.ok('some relevant assertion here');
  });

  it('Implicit /index.html', () => {
    var port = portCounter++;
    connect.server({
      port: port
    }, function () {
      request('http://localhost:' + port)
        .get('/fixtures/simplest/')
        .expect(/index page/)
        .expect(200)
        .end(function (err, res) {
          done(err);
        });
    });
  })
});