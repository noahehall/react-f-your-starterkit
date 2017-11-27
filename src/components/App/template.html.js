export default function htmlTemplate (params) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="${params.htmlWebpackPlugin.options.metaDescription}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- Disable tap highlight on IE -->
        <meta name="msapplication-tap-highlight" content="no">
        <title>${params.htmlWebpackPlugin.options.title}</title>
        ${params.htmlWebpackPlugin.options.ssr ? '<script>window.__INIT_STATE__= __SSR_STATE__</script>' : ''}
      </head>
      <body>
        <div id="root">${params.htmlWebpackPlugin.options.ssr ? '__SSR_APP__' : ''}</div>
      </body>
    </html>
  `;
}
