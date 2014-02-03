var
  gulp = require('gulp'),
  connect = require('../index'),
  stylus = require('gulp-stylus');

gulp.task('connect', connect.server({
  root: __dirname + '/app',
  port: 1337,
  livereload: true,
  open: {
    browser: 'chrome'
  }
}));

gulp.task('stylus', function () {
  gulp.src('./app/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./app/css'));
});

gulp.task('watch', function () {
  gulp.watch(['./app/stylus/*.styl'], ['stylus']);
  gulp.watch([
    './app/*.html',
    './app/css/*.css',
    './app/js/*.js'
  ], connect.reload);
});

gulp.task('default', ['connect', 'stylus', 'watch']);