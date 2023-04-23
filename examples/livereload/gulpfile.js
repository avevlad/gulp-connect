var gulp = require('gulp');
var stylus = require('gulp-stylus');
var connect = require('../../index');

gulp.task('connect', function () {
  connect.server({
    root: ['app', 'path'],
    port: 8080,
    livereload: true
  });
});

function htmlTask(cb) {
  return gulp.src('./app/*.html')
    .pipe(connect.reload())
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

gulp.task('default', gulp.parallel(['connect', htmlTask, stylusTask, 'watch']));
