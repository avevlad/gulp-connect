var gulp = require('gulp');
var connect_multi = require('../../index');
var connect = connect_multi(),
  connect2 = connect_multi();

gulp.task('connect', connect.server({
  root: ['app'],
  port: 1337,
  livereload: true,
  open: {
    browser: undefined,
    file: 'index.html'
  }
}));

gulp.task('connect', connect.server({
  root:["./app/root1/"],
  port:1337,
  livereload:{
    port: 35729
  },
  open: {
    browser: undefined,
    file: 'index.html'
  }

}));

gulp.task('connect2', connect2.server({
  root:["./app/root2/"],
  port:1338,
  livereload:{
    port: 35730
  },
  open: {
    browser: undefined,
    file: 'index.html'
  }

}));



gulp.task('watch', function() {

  gulp.watch(['./app/root1/*.html'], function(){
    var changedFile = arguments[0].path;
    gulp.src(changedFile)
      .pipe(connect.reload());
  });

  gulp.watch(['./app/root2/*.html'], function(){
    var changedFile = arguments[0].path;
    gulp.src(changedFile)
      .pipe(connect2.reload());
  });

});

gulp.task('default', ['connect','connect2','watch']);
