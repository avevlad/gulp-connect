var
  gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  connectDefault = require('../../index')(),
  connectFirefox = require('../../index')(),
  connectChrome = require('../../index')(),
  connectNone = require('../../index')();


gulp.task('connect-default', connectDefault.server({
  root: ['app', 'path'],
  port: 1337,
  livereload: true,
  open: {
    browser: undefined
  }
}));

gulp.task('connect-firefox', connectFirefox.server({
  root: ['app', 'path'],
  port: 1337,
  livereload: true,
  open: {
    browser: 'firefox'
  }
}));

gulp.task('connect-chrome', connectChrome.server({
  root: ['app', 'path'],
  port: 1337,
  livereload: true,
  open: {
    browser: 'chrome'
  }
}));


gulp.task('connect-no-browser', connectNone.server({
  root: ['app', 'path'],
  port: 1337,
  livereload: true,
  open: {
    browser: 'none'
  }
}));

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connectDefault.reload());
});

gulp.task('stylus', function () {
  gulp.src('./app/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./app/css'))
    .pipe(connectDefault.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/stylus/*.styl'], ['stylus']);
});

gulp.task('default-browser', ['connect-default', 'stylus', 'watch']);
gulp.task('chrome', ['connect-chrome', 'stylus', 'watch']);
gulp.task('firefox', ['connect-firefox', 'stylus', 'watch']);
gulp.task('connect-only', ['connect-no-browser', 'stylus', 'watch']);
