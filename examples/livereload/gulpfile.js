var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  connect = require('../../index');

gulp.task('connect', function() {
  connect.server({
    root: ['app', 'path'],
    port: 8080,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('stylus', function () {
  gulp.src('./app/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./app/css'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/stylus/*.styl'], ['stylus']);
});

gulp.task('default', ['connect', 'stylus', 'watch']);
