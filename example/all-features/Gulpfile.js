var
  gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  connect = require('../../index');

gulp.task('connect', connect.server({
  root: ['app', 'path'],
  port: 1337,
  livereload: true,
  open: {
    browser: 'chrome'
  }
}));

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
