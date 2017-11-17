/* eslint-disable */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
//import App from 'components/Layout';

function template(html) { return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>test app</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
    </head>
    <body>
        <div id="app">${html}</div>

    </body>
    </html>
`;
}

export default (req, res) => {
    const html = ReactDOMServer.renderToString(
        <div>hello</div>
    );

    res.send(template(html));
};
