# CI
  - [![Build Status](https://api.travis-ci.org/noahehall/react-f-your-starterkit.svg?branch=master)

# Why are we here?
if you need [the following](https://medium.com/front-end-developers/handcrafting-an-isomorphic-redux-application-with-love-40ada4468af4#.vfm0r9hd8):

 - Wholegrain server-side rendering
 - http2/spdy
 - offline first
 - security best practices
 - Extensible routing rich in Omega-3
 - Buttery asynchronous data loading
 - A Smooth functional after-taste

# Whats next
  - [review our list of enhancements](https://github.com/noahehall/react-f-your-startkit/labels/enhancement)
  - We are *definitely* looking for contributors!
  - Hopefully this will become the goto app dev kit for progressive web applications!

# Quick start
  - $ npm install #install all required npm modules
  - $ npm run dev #start app on localhost:3000
  - $ npm run test #test all test.js files within src/*
  - $ npm run eslint-unused #see all eslint rules not defined in .eslintrc
  - $ npm run eslint #run eslint on all .js files within /src*

# opinions
- immutability: [seamless-immutable](https://github.com/rtfeldman/seamless-immutable)
- state management: redux
- testing: mocha - chai - sinon - enzyme
- universal app with express
- styling: postcss + stylint (+stylfmt)
- hot reloadable
- build tool: gulp
- javascript: babel
- progressiveness: service workers
- QA: logmonitor, rollbar

# Supporting knowledge and projects
- [gulp recipes](http://gulpjs.org/recipes/)
- [react production vs dev](https://facebook.github.io/react/downloads.html)
- [awesome react](https://github.com/enaqx/awesome-react)
- [redux server side example](http://redux.js.org/docs/recipes/ServerRendering.html)
- [live react load gulp example](https://github.com/milankinen/livereactload/tree/master/examples/03-build-systems)
- [react boilerplate](https://github.com/jarredwitt/react-boilerplate/blob/master/gulpfile.js)
- [express js boilerplate](https://github.com/yhagio/express-boilerplate/blob/master/server.js)
- [html5 boilerplate](https://github.com/h5bp/html5-boilerplate/blob/master/src/index.html)
- [Task Runner](http://macr.ae/article/splitting-gulpfile-multiple-files.html)
- Testing boilerplate: combined the two below repos   
  - [Enzyme Example](https://github.com/lelandrichardson/enzyme-example-mocha)
  - [Gulp Spawn Mocha](https://github.com/knpwrs/gulp-spawn-mocha/tree/master/test)
- isomorphic
  - [ponyfoo](https://ponyfoo.com/articles/universal-react-babel)
  - [smashing magazine](https://www.smashingmagazine.com/2016/03/server-side-rendering-react-node-express/)
  - [isomorphic with react-helmet](https://github.com/mattdennewitz/react-helmet-example/blob/master/server.js)
  - [react cookies > localstorage](https://github.com/eXon/react-cookie)
- redux
  - [ducks bundling](https://github.com/erikras/ducks-modular-redux)
  - [redux+immutable](https://github.com/gajus/redux-immutable-examples)
  - [redux-logger](https://github.com/evgenyrodionov/redux-logger)
  - [redux-promise](https://github.com/acdlite/redux-promise)
  - [redux-seamless-immutable](https://github.com/eadmundo/redux-seamless-immutable)
- linting
  - [eslint config ct fletcher](https://github.com/noahehall/eslint-config-ct-fletcher)
  - [official eslint rules](http://eslint.org/docs/rules/)
  - [awesome eslint](https://github.com/dustinspecker/awesome-eslint)
  - [quick eslint starter](https://gist.github.com/cletusw/e01a85e399ab563b1236)
  - [find eslint rules](https://github.com/sarbbottam/eslint-find-rules)
  - [lint for accessibility](https://www.npmjs.com/package/eslint-plugin-jsx-a11y)
  - [stylint](http://stylelint.io/user-guide/rules/)
  - [stylefmt](https://github.com/morishitter/stylefmt)
  - [gulp-stylelint](https://github.com/olegskl/gulp-stylelint)
- development
  - [babel aliases](https://github.com/tleunen/babel-plugin-module-resolver)
  - [gulp and browserify](https://fettblog.eu/gulp-browserify-multiple-bundles/)
  - [gulp logging](https://gist.github.com/kyohei8/097b859efeb5bfddcd2d)
- security
  - [Helmet](https://github.com/helmetjs/helmet)
  - [http2 + ssl](https://webapplog.com/http2-node/)
    - [cert created from here](https://certsimple.com/blog/localhost-ssl-fix)
      - password: starterkit
- Progress Web app
  - Offline first
    - [service workers](https://github.com/MicheleBertoli/react-worker)
      + [strategies](https://serviceworke.rs/)
      + [general pattern](https://github.com/react-europe/www/blob/cfp/app/sw.js)
      + [good readme](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)
      + [good tuts](https://jakearchibald.github.io/isserviceworkerready/resources.html)
      + [good Q&A](http://stackoverflow.com/questions/tagged/service-worker)
      + [see all service workers](chrome://serviceworker-internals)
