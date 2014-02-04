var
  gulp = require('gulp'),
  watch = require('gulp-watch'),
  stylus = require('gulp-stylus'),
  connect = require('../index');

gulp.task('connect', connect.server({
  root: __dirname + '/app',
  port: 1337,
  livereload: true,
  open: {
    browser: 'chrome'
  }
}));

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(watch())
    .pipe(connect.reload());
});

gulp.task('stylus', function () {
  gulp.src('./app/stylus/*.styl')
    .pipe(watch())
    .pipe(stylus())
    .pipe(gulp.dest('./app/css'))
    .pipe(connect.reload());
});

gulp.task('default', ['connect', 'html', 'stylus']);