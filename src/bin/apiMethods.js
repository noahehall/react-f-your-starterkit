const headers = {
  cc: {
    'long': [ 'Cache-Control', 'public, max-age=600, s-maxage=1200' ],
  },
  ct: {
    html: [ 'Content-Type', 'text/html; charset=utf-8' ],
  },
};

export function getHeaders (request = { ct: 'html' }) {
  const finalHeaders = {};

  Object.getOwnPropertyNames(request).forEach(key => {
    if (headers[key] && headers[key][request[key]])
      finalHeaders[headers[key][request[key]][0]] = headers[key][request[key]][1];
  });

  return finalHeaders;
}
