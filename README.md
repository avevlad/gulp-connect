# [gulp](https://github.com/wearefractal/gulp)-connect-multi [![NPM version](https://badge.fury.io/js/gulp-connect-multi.png)](http://badge.fury.io/js/gulp-connect-multi) [![Dependency Status](https://david-dm.org/avevlad/gulp-connect.png)](https://david-dm.org/avevlad/gulp-connect) [![devDependency Status](https://david-dm.org/avevlad/gulp-connect.png)](https://david-dm.org/avevlad/gulp-connect#info=devDependencies)

[![NPM](https://nodei.co/npm/gulp-connect-multi.png?downloads=true&stars=true)](https://nodei.co/npm/gulp-connect-multi/)

> A fork of [gulp-connect](https://github.com/AveVlad/gulp-connect) with multiple servers support

> Gulp plugin connect to server, LiveReload and opening browser

## Install

Install with [npm](https://npmjs.org/).

```
npm install --save-dev gulp-connect-multi
```


## Example

## simplest
```js
var gulp = require('gulp'),
  connect = require('gulp-connect-multi')();

gulp.task('connect', connect.server());

gulp.task('default', ['connect']);
```


### connect + livereload + open + stylus
```js
var
  gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  connect = require('gulp-connect-multi')();

gulp.task('connect', connect.server({
  root: ['app'],
  port: 1337,
  livereload: true,
  open: {
    browser: 'chrome' // if not working OS X browser: 'Google Chrome'
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
```

**all option**

```js
gulp.task('connect', connect.server({
  root: ['app', 'some_path'],
  port: 1337,
  livereload:{
    port: 35729
  },
  open: {
    file: 'index.html',
    browser: 'firefox'
  },
  middleware: function(connect, o) {
    return [
      // ...
    ]
  }
}));
```

### multiple connects + livereload + open + stylus
```js
var
  gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  connect = require('gulp-connect-multi');

var devServer = connect(),
    coverageServer = connect();

gulp.task('connect', devServer.server({
  root: ['app'],
  port: 1337,
  livereload: true,
  open: {
    browser: 'chrome' // if not working OS X browser: 'Google Chrome'
  }
}));

gulp.task('coverage', coverageServer.server({
  root: ['coverage'],
  port: 1338,
  livereload: false,
  open: {
    browser: 'chrome' // if not working OS X browser: 'Google Chrome'
  }
}));

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(devServer.reload());
});

gulp.task('stylus', function () {
  gulp.src('./app/stylus/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./app/css'))
    .pipe(devServer.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/stylus/*.styl'], ['stylus']);
});

gulp.task('default', ['connect', 'stylus', 'watch']);
```


###coffee

    gulp --require coffee-script/register

```coffee
gulp = require("gulp")
stylus = require("gulp-stylus")
connect = require("gulp-connect-multi")()

gulp.task "connect", connect.server(
  root: ['app']
  port: 1337
  livereload: true
  open:
    browser: "chrome" # if not working OS X browser: 'Google Chrome'
)

gulp.task "html", ->
  gulp.src("./app/*.html").pipe connect.reload()

gulp.task "stylus", ->
  gulp.src("./app/stylus/*.styl")
    .pipe(stylus())
    .pipe(gulp.dest("./app/css"))
    .pipe connect.reload()

gulp.task "watch", ->
  gulp
    .watch ["./app/*.html"], ["html"]
  gulp
    .watch ["./app/stylus/*.styl"], ["stylus"]

gulp.task "default", [
  "connect"
  "stylus"
  "watch"
]
```


## API

#### options.root

Type: `Array`
Default: `['app']`

The root path

#### options.port

Type: `Number`  
Default: `3000`

The connect port

#### options.livereload

Type: `Object or Boolean`  
Default: `true`

#### options.livereload.port

Type: `Number`  
Default: `35729`


#### options.open

Type: `Object`  
Default: `{}`

#### options.open.file

Type: `String`  
Default: `index.html`

The open file

#### options.open.browser

Type: `String`  
Default: the system default browser

The type of browser, like `chrome`


## License

MIT © Vladislav Derjavin <dev@vld.me>
