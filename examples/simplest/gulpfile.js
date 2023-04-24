var gulp = require('gulp');
var connect = require('../../index');

gulp.task('connect', function() {
  connect.server();
});

gulp.task('default', ['connect']);
