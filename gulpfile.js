"use strict";

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
  concat = require('gulp-concat');


var isProd = process.env.NODE_ENV === "production"


function createBundler(useWatchify, server) {
  if (server) {
    return browserify({
      entries:      [ "src/server.js" ],
      transform:    [
        [babelify, {
          presets: [ 'es2015', 'react' ]
        }]
      ],
      plugin: [],
      debug: !isProd,
      cache: {},
      packageCache: {},
      fullPaths: !isProd,
      browserField : false,
      builtins : false,
      commondir : false,
      detectGlobals: false, //ignore all globals
      /* ignore specific globals
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
  return browserify({
    entries:      [ "src/client.js" ],
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
      [babelify, {
        presets: [ 'es2015', 'react' ]
      }],
      [envify, {}]
    ],
    plugin:       isProd || !useWatchify ? [] : [ lrload ],    // no additional configuration is needed
    debug:        !isProd,
    cache:        {},
    packageCache: {},
    fullPaths:    !isProd                       // for watchify
  })
}

gulp.task('transpile:server', function(cb) {
  var bundler = createBundler(false, true);
  return bundler
        .bundle()
        .pipe(source('server.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task("bundle:js", function() {
  var bundler = createBundler(false)
  return bundler
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./dist/public/js"))
})

gulp.task("watch:js", function() {
  // start JS file watching and rebundling with watchify
  var bundler = createBundler(true)
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
    .on("change", function () {})
    .on("restart", function () {
      console.log("Server restarted")
    })
})

gulp.task("default", gulpSequence(
    'transpile:server',
    ["watch:server", "watch:js"]
));
