// TODO: update header policy
const headers = {
  cc: {
    'long': [ 'Cache-Control', 'public, max-age=600, s-maxage=1200' ],
  },
  ct: {
    html: [ 'Content-Type', 'text/html; charset=utf-8' ],
  },
};

export function getHeaders (
  request = { ct: 'html' },
  additionalHeaders = {},
) {
  const finalHeaders = {};

  Object.getOwnPropertyNames(request).forEach(key => {
    // add matching header
    if (headers[key] && headers[key][request[key]])
      finalHeaders[headers[key][request[key]][0]] = headers[key][request[key]][1];

    // log unknown header
    else console.error(`could not find matching header for {${key}: ${request[key]}}`);
  });

  return {
    ...finalHeaders,
    ...additionalHeaders,
  };
}
