require('./.globals');
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import compression from 'compression';
import express from 'express';
import favicon from 'serve-favicon';
import fs from 'fs';
import helmet from 'helmet';
import Immutable from 'seamless-immutable';
import morgan from 'morgan';
import React from 'react';
import routes from './routes';
import spdy from 'spdy';
import FileStreamRotator from 'file-stream-rotator';
import path from 'path';
import defaultHtml from './components/defaulthtml.js';
// store
import { Provider } from 'react-redux';
import configure from './store/configure';
import initialState from './store/initialstate.js';

const port = 3000;

// https: only in production
const options = {
  cert: fs.readFileSync(`${__dirname}/server/localhost-cert.pem`),
  key: fs.readFileSync(`${__dirname}/server/localhost-key.pem`),
  plain: !appConsts.isProd,
  spdy: {
    plain: !appConsts.isProd,
    protocols: [ 'h2', 'spdy/3.1', 'spdy/3', 'spdy/2', 'http/1.1', 'http/1.0' ],
    ssl: appConsts.isProd
  }
};

const app = express();
app.use(compression());
app.use(helmet());
app.use(express.static(`${__dirname}/public`));
app.use(favicon(`${__dirname}/public/images/favicon.ico`));

// logging
const logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); // eslint-disable-line
// create rotating stream
const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false,
});
// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

/*
  setup your api as below
  // move this to top of file
  import bodyParser from 'body-parser';
  // POST /login gets urlencoded bodies
  const urlencodedParser = bodyParser.urlencoded({ extended: false })
  app.post('/login', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    res.send('welcome, ' + req.body.username)
  })

  // POST /api/users gets JSON bodies
  const jsonParser = bodyParser.json({ type: 'application/*+json' })
  app.post('/api/users', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400)
    // create user in req.body
  })
 */

const serviceWorkerFileOptions = {
  dotfiles: 'deny',
  headers: {
    'x-sent': true,
    'x-timestamp': Date.now(),
  },
  root: __dirname,
};

app.get('/container.js', (req, res) => {
  res.sendFile('./container.js', serviceWorkerFileOptions, (err) => {
    if (err) {
      appFuncs.console('error')(err);
      res.status(err.status).end();
    } else appFuncs.console()('Sent: container.js');
  });
});

app.get('/rootworker.js', (req, res) => {
  res.sendFile('./rootworker.js', serviceWorkerFileOptions, (err) => {
    if (err) {
      appFuncs.console('error')(err);
      res.status(err.status).end();
    } else appFuncs.console()('Sent: rootworker.js');
  });
});

app.get("*", (req, res) => {
  match({ location: req.url, routes }, (err, redirectLocation, renderProps) => {
    if (err) {
      appFuncs.console('error')(err);

      return res.status(500).end('Internal server error');
    }
    if (!renderProps) return res.status(404).end('Not found.');
    // setup store based on data sent in
    const store = configure(Immutable(initialState));

    const InitialComponent = ( // eslint-disable-line no-extra-parens
      <Provider store={store} >
        <RouterContext {...renderProps} />
      </Provider>
    );

    return res.status(200).send(
      defaultHtml(
        renderToString(InitialComponent),
        store.getState()
      )
    );
  });

  return true;
});

spdy.createServer(options, app)
  .listen(port, (error) => { // eslint-disable-line consistent-return
    if (error) {
      appFuncs.console('error')(`error occured starting server: ${error}`);

      return process.exit(1);
    }

    appFuncs.console('info', true)(`Server running: ${!appConsts.isProd ? 'http://127.0.0.1' : 'https://localhost'}:${port}`);
  });
