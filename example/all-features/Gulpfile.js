var
  gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  connect = require('../../index');

console.log(connect);

gulp.task('connect', connect({
  root: ['app', 'path']
}));

connect.test();

gulp.task('default', ['connect']);
