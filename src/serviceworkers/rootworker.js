/**
 * @file service worker for root
 * @author @noahedwardhall
 */

/* eslint-disable indent */
require('../.globals');
import Promised from 'bluebird';
import Idbstore from 'serviceworkers/idb/idb';
const protocol = self.location.protocol;
appFuncs.console()(`protocol is: ${protocol}`);

const db = new Idbstore();
db.dbPromise
  .then(
    (thisDb) => thisDb,
    (bad) => {
      appFuncs.console('dir', true)(bad);
      appFuncs.console('error')('db rejected on instantiation');
    }
  );

// self = ServiceWorkerGlobalScope
self.addEventListener('install', (event) => {
  const urlsToPrefetch = [
    '/',
    'https://cdn.logrocket.com/LogRocket.min.js',
    // 'http://fonts.googleapis.com/css?family=Muli|Eczar|Varela%20Round',
    // 'https://api.travis-ci.org/noahehall/udacity-trainschedule.svg?branch=master',
    `${protocol}//localhost:3000/container.js`,
    `${protocol}//localhost:3000/favicon.ico`,
    `${protocol}//localhost:3000/js/bundle.js`,
    `${protocol}//localhost:3000/rootworker.js`,
  ];

  /**
   * all prefetch urls are required or installation will fail
   */
  event.waitUntil(new Promised((resolve, reject) => {
    const complete = urlsToPrefetch.map((prefetchThisUrl) =>
      navigator.onLine && fetch(new Request(prefetchThisUrl))
        .then((resp) =>
          resp.blob()
            .then((blob) => {
              appFuncs.console('info')(`blob is: ${blob.size}, ${blob.type}`);

              return db.set(prefetchThisUrl, blob);
            })
        )
    );

    if (complete.length)
      resolve(complete);
    else {
      appFuncs.console('error')(`did not complete fetching: ${complete.length}`);
      reject();
    }
  })
    .catch((addAllError) => appFuncs.console('error')(`error in adding prefetch urls: ${addAllError}`))
  );
});

/**
 * event api: https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
 * event.request API https://developer.mozilla.org/en-US/docs/Web/API/Request
 * headers https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
self.addEventListener('fetch', (event) => {
  const neverCacheUrls = [
    `${protocol}//localhost:3000/js/bundle.js`,
    // `${protocol}//logrocket-1356.appspot.com/v1/ingest`, // handled by neverCacheHttpMethods
  ];

  const neverCacheHttpMethods = [
    'POST'
  ];

  // never cache urls
  if (navigator.onLine && neverCacheUrls.indexOf(event.request.clone().url) !== -1)
     // appFuncs.console()(`not caching url: ${event.request.url} `);
    return event.respondWith(fetch(event.request));

  // never cache http methods
  if (navigator.onLine && neverCacheHttpMethods.indexOf(event.request.clone().method) !== -1)
    // appFuncs.console()(`not caching http method: ${event.request.url}, ${event.request.clone().method} `);
    return event.respondWith(fetch(event.request));

  return event.respondWith(new Promised((resolve, reject) => {
    db.get(event.request.url).then((blobFound) => {
      if (!blobFound) {
        if (!navigator.onLine) return appFuncs.fakeResponse();

        return fetch(event.request.clone().url)
          .then((response) => {
            if (!response) {
              appFuncs.console()(`received invalid response from fetch: ${response}`);

              return reject(response);
            }

            // insert response body in db
            response.clone().blob().then(
              (blob) => {
                if (blob.size) {
                  appFuncs.console('info')(`updating db with: ${event.request.url}`);

                  return db.set(
                    event.request.url,
                    blob
                  ).then(
                    (success) => success,
                    (error) => appFuncs.console('error')(`error in setting: ${error}`)
                  );
                }

                // never insert blobs with 0 bytes
                return false;
              },
              (noBlob) => appFuncs.console()(`blob not generated from cloned response:${noBlob}`)
            );

            return resolve(response);
          });
      }
      // blob found logic
      const contentType = appFuncs.getBlobType(blobFound, event.request.url);
      appFuncs.console()(`responding from cache: ${event.request.url}, contentType: ${contentType}, size: ${blobFound.size}`);

      const myHeaders = {
        "Content-Length": String(blobFound.size),
        "Content-Type": contentType,
        "X-Custom-type": "Provided by Serviceworker",
      };

      const init = {
        'headers': myHeaders,
        'status' : 200,
        'statusText' : 'OKS',
      };
      const response = new Response(blobFound, init);

      return resolve(response);
    });
  }));
});

/*
self.addEventListener('activate', (event) => {
  const expectedCacheNames = Object.keys(CURRENT_CACHES).map((key) =>
    CURRENT_CACHES[key]
  );

  /**
   * Delete all caches that aren't named in CURRENT_CACHES.
   *
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promised.all(
        cacheNames.map((cacheName) =>
          expectedCacheNames.indexOf(cacheName) === -1 ?
            caches.delete(cacheName) :
            null
        )
      )
    )
  );
});

self.addEventListener('sync', (event) => {
  appFuncs.console()(`sync event: ${JSON.stringify(event)}`);
});

self.addEventListener('push', (event) => {
  appFuncs.console()(`push event: ${JSON.stringify(event)}`);
});

self.addEventListener('message', (event) => {
  // event.data === whatever sent from Client.postMessage
  appFuncs.console()(`message event: ${JSON.stringify(event)}`);
});
*/
