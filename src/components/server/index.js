/* eslint-disable */

export default function template(html) { return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>test app</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
    </head>
    <body>
        <div id="root">${html}</div>

    </body>
    </html>
`;
}
