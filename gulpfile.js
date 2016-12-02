require('babel-core/register');
require('./src/.globals');

// TODO: check https://github.com/ben-ng/minifyify

const
  babelify = require("babelify"),
  browserify = require("browserify"),
  buffer = require("vinyl-buffer"),
  checkInternet = require('./src/server/checkconnection.js').checkInternet,
  env = require('gulp-env'),
  envify = require("loose-envify"),
  es = require('event-stream'),
  eslint = require('gulp-eslint'),
  glob = require('glob'),
  gstylelint = require('gulp-stylelint'),
  gulp = require('gulp'),
  gulpCopy = require('gulp-copy'),
  gulpif = require('gulp-if'),
  gulpSequence = require('gulp-sequence'),
  gutil = require("gulp-util"),
  lrload = require("livereactload"),
  mocha = require('gulp-spawn-mocha'),
  nodemon = require("gulp-nodemon"),
  postCss = require('browserify-postcss'),
  rename = require('gulp-rename'),
  reporter = require('postcss-reporter'),
  source = require("vinyl-source-stream"),
  sourcemaps = require('gulp-sourcemaps'),
  stringify = require('stringify'),
  uglify = require('gulp-uglify'),
  watchify = require("watchify");

function createBundler (useWatchify, server) {
  return browserify({
    browserField : !server && true,
    builtins : !server && true,
    cache: {},
    commondir : !server && true,
    debug: !appConsts.isProd,
    // ignore all globals
    detectGlobals: !server && true,
    entries: [`src/${server ? 'server' : 'client'}.js`],
    fullPaths: !appConsts.isProd,
    packageCache: {},
    plugin: appConsts.isProd || !useWatchify ? [] : [[ lrload, {
      client: true,
      host: '127.0.0.1',
      port: 4474,
      server: true,
    }]],
    transform: [
      [ stringify, {
        appliesTo: { includeExtensions: ['.md'] },
        minify: appConsts.isProd
      }],
      [ postCss, {
        extensions: [ '.css', '.scss' ],
        inject: false,
        plugin:[
          [ 'postcss-import', {
            from: 'src/',
            path: [
              'node_modules/ionicons/dist/css',
              'node_modules/ionicons/dist/fonts',
            ]
          }],
          [ 'postcss-cssnext', {
            browsers: ['last 3 versions']
          }],
          'postcss-extend',
          [ reporter, { clearMessages: true }]
        ]
      }],
      [ babelify, {}],
      [ envify, {}]
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
    .pipe(gulpif(appConsts.isProd, uglify()))
    .pipe(gulp.dest('./dist'));
});

gulp.task("bundle:client", () => {
  const bundler = createBundler(false, false);

  return bundler
    .bundle()
    .on("error", gutil.log)
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(gulpif(appConsts.isProd, uglify()))
    .pipe(gulp.dest("./dist/public/js"));
});

gulp.task("watch:client", () => {
  const bundler = createBundler(true, false);
  const watcher = watchify(bundler);
  function rebundle () {
    gutil.log("Update JavaScript bundle");
    watcher
      .bundle()
      .on("error", gutil.log)
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(gulpif(!appConsts.isProd, sourcemaps.init()))
      .pipe(gulpif(appConsts.isProd, uglify()))
      .pipe(gulpif(!appConsts.isProd, sourcemaps.write('./')))
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
    ignore: [ "gulpfile.js", "node_modules/*" ],
    script: "dist/server.js",
    tasks: [ 'copy:service-workers', 'bundle:server' ],
    watch: [ 'src/server.js', 'dist/public/js/bundle.js', 'src/serviceworkers' ]
  })
    .on("error", gutil.log)
    .on("change", gutil.log)
    .on("restart", gutil.log)
);

gulp.task('test', () =>
  gulp.src(['./src/**/*.test.js'], { read: false })
    .pipe(mocha({
      debugBrk: !appConsts.isProd,
      istanbul: !appConsts.isProd,
      reporter: !appConsts.isProd ? 'spec' : 'nyan',
      require: './.setup.test.js'
    }))
    .on("error", gutil.log)
);

gulp.task('eslint', () =>
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
  gulp.src([ './src/**/*.js', '!node_modules/**' ])
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
      debug: !appConsts.isProd,
      failAfterError: true,
      reportOutputDir: 'coverage/lint',
      reporters: [
        { console: true, formatter: 'verbose' },
        { formatter: 'json', save: 'report.json' }
      ],
    }))
);

gulp.task('copy:server-certs', () =>
  gulp
    .src('./src/server/*')
    .pipe(gulpCopy('./dist/server', { prefix: 2 }))
);

gulp.task('copy:service-workers', (done) =>
  glob('./src/serviceworkers/*.js', (err, files) => {
    if (err) done(err);

    const tasks = files.map((entry) =>
      browserify({
        browserField: true,
        builtins: true,
        cache: {},
        commondir: true,
        detectGlobals: true,
        entries: [entry],
        fullPaths: appConsts.isProd,
        packageCache: {},
        transform: [
          [ babelify, {}],
          [ envify, {}]
        ]
      })
        .bundle()
        .on("error", gutil.log)
        .pipe(source(entry))
        .pipe(buffer())
        .pipe(gulpif(appConsts.isProd, uglify()))
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest('./dist'))
    );
    es.merge(tasks).on('end', done);
  }));

gulp.task('checkconnection', (cb) =>
  checkInternet((isConnected) => {
    if (isConnected) {
      appFuncs.console()(`is connected: ${isConnected}`);
      env.set({
        NODE_ONLINE: 'true'
      });

      return cb(null);
    }

    appFuncs.console()(`is not connected: ${isConnected}`);

    return cb(null);
  })
);

gulp.task("default", gulpSequence(
  'checkconnection',
  'stylelint',
  'eslint',
  'test',
  'copy:server-certs',
  'copy:service-workers',
  "watch:server",
  "watch:client"
));

gulp.task("prod", gulpSequence(
  'copy:server-certs',
  'copy:service-workers',
  'bundle:server',
  'bundle:client'
));

gulp.task('lint', gulpSequence(
  'stylelint',
  'eslint'
));
