import { describe, it, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import connect from '../index.js';

var portCounter = 36000;
console.log("port", portCounter);

describe('Simple', async () => {
  after(() => {
    connect.serverClose()
    console.log("Close server");
  });

  it('is a subtest', async () => {
    return new Promise((resolve, reject) => {
      var port = portCounter++;
      console.log("port in subtest", port);
      connect.server({
        port: port
      }, () => {
        console.log("ok");
        request('http://localhost:' + port)
          .get('/fixtures/simplest/test.txt')
          .expect(/Hello world/)
          .expect(200)
          .end((err, res) => err ? reject(err) : resolve());
      });
    });
  });

  it('Implicit /index.html', () => {
    return new Promise((resolve, reject) => {
      var port = portCounter++;
      connect.server({
        port: port
      }, function () {
        request('http://localhost:' + port)
          .get('/fixtures/simplest/')
          .expect(/index page/)
          .expect(200)
          .end((err, res) => err ? reject(err) : resolve());
      });
    });
  });
});