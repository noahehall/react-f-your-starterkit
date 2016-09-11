"use strict";
require('babel-core/register');

var gulp       = require("gulp"),
  gutil      = require("gulp-util"),
  nodemon    = require("gulp-nodemon"),
  source     = require("vinyl-source-stream"),
  buffer     = require("vinyl-buffer"),
  browserify = require("browserify"),
  watchify   = require("watchify"),
  babelify   = require("babelify"),
  envify     = require("envify"),
  lrload     = require("livereactload"),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  gulpSequence = require('gulp-sequence'),
  postCss = require('browserify-postcss'),
  mocha      = require('gulp-spawn-mocha'),
  concat = require('gulp-concat');

var isProd = process.env.NODE_ENV === "production"

function createBundler(useWatchify, server) {
    return browserify({
      entries:      [ `src/${server ? 'server' : 'client'}.js`   ],
      transform:    [
        [postCss, {
          plugin:[
            ['postcss-cssnext',{
              browsers: ['last 3 versions']
            }],
            'postcss-import',
            'postcss-extend',
          ],
          inject: true,
          extensions: ['.css','.scss']
        }],
        [babelify, {}],
        [envify, {}]
      ],
      plugin:       isProd || !useWatchify ? [] : [ lrload ],
      debug:        !isProd,
      cache:        {},
      packageCache: {},
      fullPaths:    !isProd,
      browserField : server ? false : true,
      builtins : server ? false : true,
      commondir : server ? false : true,
      detectGlobals: server ? false : true //ignore all globals
      /* ignore specific globals, should only be set when server is true
      insertGlobalVars : {
          process: undefined,
          global: undefined,
          'Buffer.isBuffer': undefined,
          Buffer: undefined,
          __dirname: undefined
      }
      */
    })
}

gulp.task('transpile:server', function(cb) {
  var bundler = createBundler(false, true);
  return bundler
    .bundle()
    .on("error", gutil.log)
    .pipe(source('server.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task("bundle:js", function() {
  var bundler = createBundler(false, false)
  return bundler
    .bundle()
    .on("error", gutil.log)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./dist/public/js"))
})

gulp.task("watch:js", function() {
  // start JS file watching and rebundling with watchify
  var bundler = createBundler(true, false)
  var watcher = watchify(bundler)
  rebundle()
  return watcher
    .on("error", gutil.log)
    .on("update", rebundle)

  function rebundle() {
    gutil.log("Update JavaScript bundle")
    watcher
      .bundle()
      .on("error", gutil.log)
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(gulp.dest("./dist/public/js"))
  }
})

gulp.task("watch:server", function() {
  return nodemon({ script: "dist/server.js", ext: "js", ignore: ["gulpfile.js", "bundle.js", "node_modules/*"] })
    .on("error", gutil.log)
    .on("change", function () {})
    .on("restart", function () {
      console.log("Server restarted")
    })
})

gulp.task('test', function () {
  return gulp.src(['./src/**/*.test.js'], {read: false})
    .pipe(mocha({
      debugBrk: !isProd,
      require: './.setup.test.js',
      reporter: !isProd ? 'spec' : 'nyan',
      istanbul: !isProd,
      bail: false,
      ui: 'bdd'
    }))
    .on("error", gutil.log);
});

gulp.task("default", gulpSequence(
    'transpile:server',
    ["watch:server", "watch:js"]
));
