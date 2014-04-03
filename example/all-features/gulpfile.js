var
  gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  connect = require('../../index');

gulp.task('connect', function() {
  connect({
    root: ['app'],
    host: 'localhost',
    port: 1337,
    livereload: true,
    open: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('default', ['connect', 'watch']);
