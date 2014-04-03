<<<<<<< HEAD
[gulp](https://github.com/wearefractal/gulp)-connect [![NPM version](https://badge.fury.io/js/gulp-connect.png)](http://badge.fury.io/js/gulp-connect) [![Dependency Status](https://david-dm.org/avevlad/gulp-connect.png)](https://david-dm.org/avevlad/gulp-connect) [![devDependency Status](https://david-dm.org/avevlad/gulp-connect.png)](https://david-dm.org/avevlad/gulp-connect#info=devDependencies)
==================


=======

[gulp](https://github.com/wearefractal/gulp)-connect [![NPM version](https://badge.fury.io/js/gulp-connect.png)](http://badge.fury.io/js/gulp-connect) [![Dependency Status](https://david-dm.org/avevlad/gulp-connect.png)](https://david-dm.org/avevlad/gulp-connect) [![devDependency Status](https://david-dm.org/avevlad/gulp-connect.png)](https://david-dm.org/avevlad/gulp-connect#info=devDependencies)
==================


>>>>>>> js2coffee
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
  connect();
});

gulp.task('default', ['connect']);
```


#### LiveReload
```js
var gulp = require('gulp'),
  connect = require('gulp-connect');

gulp.task('connect', connect({
  root: ['app'],
  livereload: true
}));

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('default', ['connect', 'watch']);
```


## API

#### options.root
Type: `Array`
Default: `['app']`  
Example: `root: [__dirname+'/']` for current base dir

For example:
`root: [__dirname+'/']` for current base dir

The root path

#### options.port

Type: `Number`  
Default: `3000`

The connect webserver port

#### options.livereload

Type: `Object or Boolean`  
Default: `true`

#### options.livereload.port

Type: `Number`  
Default: `35729`

<<<<<<< HEAD
#### options.open.file

Type: `String`  
Default: `index.html`

The file to open in the browser

#### options.open.browser

Type: `String`  
Default: the system default browser

The name of the browser (Example: `chrome`, on OSX: `Google Chrome`)


=======
>>>>>>> js2coffee
## License

MIT © Vladislav Derjavin <dev@vld.me>
