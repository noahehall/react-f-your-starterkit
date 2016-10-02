/* eslint-disable no-console */
import express from 'express';
import React from 'react';
//import Helmet from 'react-helmet';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation';
import routes from './routes';
import Immutable from 'immutable';
import Helmet from 'react-helmet';

//store
import { Provider } from 'react-redux';
import configure from './store/configure';

function renderFullPage(html, preloadedState) {
  const head = Helmet.rewind();

  return `
    <!doctype html>
      <html ${head.htmlAttributes.toString()}>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${head.title}
        ${head.meta}
        ${head.link}
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
        </script>
        <script src="/js/bundle.js"></script>
      </body>
    </html>
    `;
}

const app = express();
app.use(express.static(`${__dirname}/public`));

app.get("*", (req, res) => {
  const location = createLocation(req.url);
  match({ location, routes }, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err);

      return res.status(500).end('Internal server error');
    }
    if (!renderProps) return res.status(404).end('Not found.');
    //setup store based on data sent in
    const store = configure(Immutable.fromJS({
      msg: 'react for your starter kit needs!',
    }));
    const initialState = store.getState();

    const InitialComponent = ( //eslint-disable-line no-extra-parens
      <Provider store={store} >
        <RouterContext {...renderProps} />
      </Provider>
    );
    const html = renderToString(InitialComponent);

    return res.end(renderFullPage(html, initialState));
  });

  return true;
});

app.listen(3000);
