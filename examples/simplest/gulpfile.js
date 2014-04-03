var
  gulp = require('gulp'),
  connect = require('../../index');

gulp.task('connect', function() {
  connect.server();
});

gulp.task('default', ['connect']);
