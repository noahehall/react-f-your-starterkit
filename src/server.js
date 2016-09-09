import express from 'express';
import React from 'react';
import Helmet from 'react-helmet';
import { renderToString }        from 'react-dom/server'
import { RouterContext, match } from 'react-router';
import createLocation            from 'history/lib/createLocation';
import routes                    from './routes';
import Immutable from 'immutable';

//store
import { Provider } from 'react-redux';
import configure from './store/configure';

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script src="/js/bundle.js"></script>
      </body>
    </html>
    `
}

const app = express();
app.use(express.static(__dirname +'/public'));

app.get("*", function (req, res) {
  const location = createLocation(req.url);
  match({ routes, location }, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }
    if (!renderProps) return res.status(404).end('Not found.');
    //setup store based on data sent in
    let store = configure(Immutable.fromJS({msg:'hello noah'}));
    let initialState = store.getState();

      const InitialComponent = (
        <Provider store={store} >
          <RouterContext {...renderProps} />
        </Provider>
      );
      const html = renderToString(InitialComponent);
      res.send(renderFullPage(html));

  });

})

app.listen(3000)
