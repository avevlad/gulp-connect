var
  gulp = require('gulp'),
  connect = require('../../index');

gulp.task('connect', function() {
  connect();
});

gulp.task('default', ['connect']);