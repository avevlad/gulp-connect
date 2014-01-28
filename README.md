# [gulp](https://github.com/wearefractal/gulp)-connect

> Gulp plugin connect to server and opening browser

## Install

Install with [npm](https://npmjs.org/package/gulp-mocha)

```
npm install --save-dev gulp-connect
```


## Example

js
```js
var connect = require('gulp-connect');

gulp.task('connect', connect({
  root: __dirname + '/app',
  port: 3000,
  open: {
    file: 'index.html',
    browser: 'chrome'
  }
}));

gulp.task('default', function () {
  gulp.run('connect');
});
```

coffee
```coffee
connect = require("gulp-connect")
gulp.task "connect", connect(
  root: __dirname + "/app"
  port: 3000
  open:
    file: "index.html"
    browser: "chrome"
)
gulp.task "default", ->
  gulp.run "connect"

```

## API

### connect(options)


#### options.root

Type: `String`
Default: `app`

#### options.port

Type: `Number`
Default: `3000`

#### options.open.file

Type: `String`
Default: `index.html`

#### options.open.browser

Type: `String`
Default: `chrome`


## License

MIT © Vladislav Derjavin <dev@vld.me>
