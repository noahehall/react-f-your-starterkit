/* eslint-disable multiline-ternary, no-unneeded-ternary */
require('babel-core/register');

const
  babelify = require("babelify"),
  browserify = require("browserify"),
  // <----- convert from streaming to buffered vinyl file object
  buffer = require("vinyl-buffer"),
  envify = require("loose-envify"),
  eslint = require('gulp-eslint'),
  gstylelint = require('gulp-stylelint'),
  gulp = require("gulp"),
  gulpCopy = require('gulp-copy'),
  gulpSequence = require('gulp-sequence'),
  gulpif = require('gulp-if'),
  gutil = require("gulp-util"),
  lrload = require("livereactload"),
  mocha = require('gulp-spawn-mocha'),
  nodemon = require("gulp-nodemon"),
  postCss = require('browserify-postcss'),
  reporter = require('postcss-reporter'),
  source = require("vinyl-source-stream"),
  sourcemaps = require('gulp-sourcemaps'),
  stringify = require('stringify'),
  // check https://github.com/ben-ng/minifyify
  uglify = require('gulp-uglify'),
  watchify = require("watchify");

const isProd = process.env.NODE_ENV === "production";

function createBundler(useWatchify, server) {
  return browserify({
    browserField : server ? false : true,
    builtins : server ? false : true,
    cache: {},
    commondir : server ? false : true,
    debug: !isProd,
    //ignore all globals
    detectGlobals: server ? false : true,
    entries: [`src/${server ? 'server' : 'client'}.js`],
    fullPaths: !isProd,
    packageCache: {},
    plugin: isProd || !useWatchify ? []: [[lrload, {
      client: true,
      host: '127.0.0.1',
      port: 4474,
      server: true,
    }]],
    transform: [
      [stringify, {
        appliesTo: { includeExtensions: ['.md'] },
        minify: isProd
      }],
      [postCss, {
        extensions: ['.css', '.scss'],
        inject: false,
        plugin:[
          ['postcss-cssnext', {
            browsers: ['last 3 versions']
          }],
          'postcss-import',
          'postcss-extend',
          [reporter, { clearMessages: true }]
        ]
      }],
      [babelify, {}],
      [envify, {}]
    ]

    /* ignore specific globals, should only be set when server is true
    insertGlobalVars : {
        process: undefined,
        global: undefined,
        'Buffer.isBuffer': undefined,
        Buffer: undefined,
        __dirname: undefined
    }
    */
  });
}

gulp.task('bundle:server', () => {
  const bundler = createBundler(false, true);

  return bundler
    .bundle()
    .on("error", gutil.log)
    .pipe(source('server.js'))
    .pipe(buffer())
    .pipe(gulpif(isProd, uglify()))
    .pipe(gulp.dest('./dist'));
});

gulp.task("bundle:client", () => {
  const bundler = createBundler(false, false);

  return bundler
    .bundle()
    .on("error", gutil.log)
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(gulpif(isProd, uglify()))
    .pipe(gulp.dest("./dist/public/js"));
});

gulp.task("watch:client", () => {
  const bundler = createBundler(true, false);
  const watcher = watchify(bundler);
  function rebundle() {
    gutil.log("Update JavaScript bundle");
    watcher
      .bundle()
      .on("error", gutil.log)
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(gulpif(!isProd, sourcemaps.init()))
      .pipe(gulpif(isProd, uglify()))
      .pipe(gulpif(!isProd, sourcemaps.write('./')))
      .pipe(gulp.dest("./dist/public/js"));
  }
  // start JS file watching and rebundling with watchify
  rebundle();

  return watcher
    .on("error", gutil.log)
    .on("update", rebundle);
});

gulp.task("watch:server", () =>
  nodemon({
    ext: "js",
    ignore: ["gulpfile.js", "node_modules/*"],
    script: "dist/server.js",
    tasks: ['bundle:server'],
    watch: ['src/server.js', 'dist/public/js/bundle.js']
  })
  .on("error", gutil.log)
  .on("change", gutil.log)
  .on("restart", gutil.log)
);

gulp.task('test', () =>
  gulp.src(['./src/**/*.test.js'], {read: false})
    .pipe(mocha({
      debugBrk: !isProd,
      istanbul: !isProd,
      reporter: !isProd ? 'spec' : 'nyan',
      require: './.setup.test.js'
    }))
    .on("error", gutil.log)
);

gulp.task('eslint', () =>
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
  gulp.src(['./src/**/*.js', '!node_modules/**'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
);

gulp.task('stylelint', () =>
  gulp
  .src('src/**/*.css')
  .pipe(gstylelint({
    debug: !isProd,
    failAfterError: true,
    reportOutputDir: 'coverage/lint',
    reporters: [
      {console: true, formatter: 'verbose'},
      {formatter: 'json', save: 'report.json'}
    ]
  }))
);

gulp.task('copy:server-certs', () =>
  gulp
    .src('./src/server/*')
    .pipe(gulpCopy('./dist/server', { prefix: 2 }))
);

gulp.task("default", gulpSequence(
    'stylelint',
    'eslint',
    'test',
    'copy:server-certs',
    "watch:server",
    "watch:client"
));

gulp.task("prod", gulpSequence(
    'copy:server-certs',
    'bundle:server',
    'bundle:client'
));
