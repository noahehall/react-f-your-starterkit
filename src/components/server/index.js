/* eslint-disable */

export default function template(html, webAssets) { return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>test app</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
        ${ webAssets.css.join('\n') }
        ${ webAssets.json.join('\n') }
    </head>
    <body>
        <div id="root">${html}</div>
        ${ webAssets.jsFirst.join('\n') }
        ${ webAssets.jsSecond.join('\n') }
    </body>
    </html>
`;
}
