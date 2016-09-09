import express from 'express';
import React from 'react';
import Helmet from 'react-helmet';
import { renderToString }        from 'react-dom/server'
import { RouterContext, match } from 'react-router';
import createLocation            from 'history/lib/createLocation';
import routes                    from './routes';
import Immutable from 'immutable';

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="root"></div>
        <script src="/js/bundle.js"></script>
      </body>
    </html>
    `
}

const app = express();
app.use(express.static(__dirname +'/public'));

app.get("*", function (req, res) {

  res.send(renderFullPage(renderToString(routes)));
})

app.listen(3000)
