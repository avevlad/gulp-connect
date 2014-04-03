[gulp](https://github.com/wearefractal/gulp)-connect [![NPM version](https://badge.fury.io/js/gulp-connect.png)](http://badge.fury.io/js/gulp-connect) [![Dependency Status](https://david-dm.org/avevlad/gulp-connect.png)](https://david-dm.org/avevlad/gulp-connect) [![devDependency Status](https://david-dm.org/avevlad/gulp-connect.png)](https://david-dm.org/avevlad/gulp-connect#info=devDependencies)
==================


> Gulp plugin to run a webserver (with LiveReload)

## Install

```
npm install --save-dev gulp-connect
```


## Usage

```js
var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server();
});

gulp.task('default', ['connect']);
```


#### LiveReload
```js
var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: ['app'],
    port: 1337,
    livereload: true
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
```

#### Multiple server

```js
var
  gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  connect = require('gulp-connect');

gulp.task('connectDev', function () {
  connect.server({
    root: ['app'],
    port: 8000,
    livereload: true
  });
});

gulp.task('connectDist', function () {
  connect.server({
    root: ['dist'],
    port: 5000,
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

gulp.task('default', ['connectDist', 'connectDev', 'watch']);

```

## API

#### options.root

Type: `Array`  
Default: `['app']`  
For example: `root: [__dirname+'/']` for current base dir

The root path

#### options.port

Type: `Number`  
Default: `1337`

The connect webserver port

#### options.livereload

Type: `Object or Boolean`  
Default: `false`

#### options.livereload.port

Type: `Number`  
Default: `35729`


## License

MIT © Vladislav Derjavin <dev@vld.me>
