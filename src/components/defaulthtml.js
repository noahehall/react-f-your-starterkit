import Helmet from 'react-helmet';
import lz from 'lz-string';

export const defaultHtml = (html, preloadedState) => {
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
        ${head.script}
      </head>
      <body>
        <article id="root">${html}</article>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(lz.compress(JSON.stringify(preloadedState)))}
        </script>
        <script src='/js/bundle.js' type='text/javascript'></script>
        ${appConsts.idb ? "<script src='/public/container.js' type='text/javascript'></script>" : "<div></div>"}
      </body>
    </html>
    `;
};

export default defaultHtml;
