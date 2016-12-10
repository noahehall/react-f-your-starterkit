require('babel-core/register');
require('./src/.globals');

// TODO: check https://github.com/ben-ng/minifyify

const
  babelify = require("babelify"),
  browserify = require("browserify"),
  buffer = require("vinyl-buffer"),
  checkInternet = require('./src/server/checkconnection.js').checkInternet,
  del = require('del'),
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

gulp.task('clean', (fn) => {
  del([
    'dist',
  ], fn);
});

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

gulp.task("watch:server", (cb) => {
  let called = false;
  const stream = nodemon({
    args: ['--trace-sync-io'],
    ext: "js",
    ignore: [ "gulpfile.js", "node_modules/*" ],
    script: "dist/server.js",
    tasks: ['bundle:server'],
    watch: [ 'src/server.js', 'dist/public/js/bundle.js' ]
  });

  stream
    .on("error", gutil.log)
    .on("start", () => {
      // ensure start only got called once
      if (!called) cb();
      called = true;
    })
    .on("change", gutil.log)
    .on("restart", gutil.log)
    .on('crash', () => {
      appFuncs.console('error')('Application has crashed!\n');
      // restart the server in 5 seconds
      stream.emit('restart', 5);
    });
});

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

gulp.task('eslint', () => {
  /**
   * Captures eslint log for each file
   * @method isFixed
   * @param  {Object} file file.eslint[filePath|messages|errorCount|warningCount]
   * @return {Boolean} [description]
   */
  function isFixed (file) {
    const didFix = file.eslint && typeof file.eslint.output === 'string';
    if (didFix) appFuncs.console()(`eslint fixed file: ${file.filePath}`);

    return didFix;
  }

  return gulp.src([ './src/**/*.js', '!node_modules/**' ])
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(gulpif(isFixed, gulp.dest('./src')))
    .pipe(eslint.failAfterError());
});

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

gulp.task('copy:service-workers', (done) => {
  if (!appFuncs.isProd) {
    const watchServiceWorkers = gulp // eslint-disable-line
    .watch('./src/serviceworkers/*.js', ['copy:service-workers']);

    watchServiceWorkers.on('change', (event) =>
      console.log(`File ${event.path} was ${event.type$}, running tasks...`));
  }

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
  });
});

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

gulp.task('exit', () => process.exit(0));

gulp.task("default", gulpSequence(
  'checkconnection',
  'stylelint',
  'eslint',
  'test',
  "watch:client",
  'copy:server-certs',
  'copy:service-workers',
  "bundle:server",
  "watch:server"
));

gulp.task("prod",
  gulpSequence(
    'copy:server-certs',
    'copy:service-workers',
    'bundle:client',
    'bundle:server',
    'exit'
  )
);

gulp.task('lint', gulpSequence(
  'stylelint',
  'eslint'
));
