var gulp = require('gulp');
var stylus = require('gulp-stylus');
var connect = require('../../index');

gulp.task('connectDev', function () {
  connect.server({
    root: ['app', 'tmp'],
    port: 8000,
    livereload: true
  });
});

gulp.task('connectDist', function () {
  connect.server({
    root: 'dist',
    port: 8001,
    livereload: true
  });
});

function htmlTask(cb) {
  return gulp.src('./app/*.html')
    .pipe(connect.reload());
}

function stylusTask(cb) {
  return gulp.src('./app/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./app/css'))
    .pipe(connect.reload());
}

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], gulp.series(htmlTask));
  gulp.watch(['./app/stylus/*.styl'], gulp.series(stylusTask));
});

gulp.task('default', ['connectDist', 'connectDev', 'watch']);
