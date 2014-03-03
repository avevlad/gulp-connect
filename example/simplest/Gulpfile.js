var
  gulp = require('gulp'),
  connect = require('../../index');

gulp.task('connect', connect.server());

gulp.task('default', ['connect']);
