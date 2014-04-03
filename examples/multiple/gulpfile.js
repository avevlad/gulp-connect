var
  gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  connectDev = require('../../index'),
  connectDist = require('../../index');

gulp.task('connectDist', function() {
  connectDev.server({
    root: ['dist'],
    port: 5000
  });
});

gulp.task('connectDev', function() {
  connectDev.server({
    root: ['app'],
    port: 8000,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connectDev.reload());
});

gulp.task('stylus', function () {
  gulp.src('./app/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./app/css'))
    .pipe(connectDev.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/stylus/*.styl'], ['stylus']);
});

gulp.task('default', ['connectDist', 'connectDev', 'stylus', 'watch']);
