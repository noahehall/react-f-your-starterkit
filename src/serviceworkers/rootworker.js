/**
 * @file service worker for root
 * @author @noahedwardhall
 */

/* eslint-disable indent */
require('../.globals');
import Promised from 'bluebird';
import Idbstore from 'serviceworkers/idb/idb';
const protocol = self.location.protocol;
const hostname = self.location.hostname;

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
    'https://fonts.googleapis.com/css?family=Muli|Varela%20Round',
    'https://api.travis-ci.org/noahehall/udacity-restaurant.svg?branch=master',
    `${protocol}//${hostname}:3000/container.js`,
    `${protocol}//${hostname}:3000/favicon.ico`,
    //`${protocol}//${hostname}:3000/js/bundle.js`,
    //`${protocol}//${hostname}:3000/rootworker.js`,
  ];

  /**
   * all prefetch urls are required or installation will fail
   */
  event.waitUntil(new Promised((resolve) => {
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

    if (!complete.length) {
      appFuncs.console('error')(`did not complete fetching: ${complete.length}`);
      reject();
    }

    return resolve(true);
  })
    .then(() => self.skipWaiting())
    .catch((addAllError) => appFuncs.console('error')(`error in adding prefetch urls: ${addAllError}`))
  );
});

self.addEventListener('activate', (event) =>
  // take ocntrol immediately
  event.waitUntil(self.clients.claim()));

/**
 * event api: https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
 * event.request API https://developer.mozilla.org/en-US/docs/Web/API/Request
 * headers https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
self.addEventListener('fetch', (event) => {
  const neverCacheUrls = [
    `${protocol}//${hostname}:3000/js/bundle.js`,
    'https://logrocket-1356.appspot.com/v1/ingest',
    `${protocol}//${hostname}:3000/rootworker.js`,
  ];

  const neverCacheHttpMethods = [
    'POST'
  ];

  // never cache urls
  if (navigator.onLine && neverCacheUrls.indexOf(event.request.clone().url) !== -1)
    return event.respondWith(fetch(event.request));
  // never cache http methods
  if (navigator.onLine && neverCacheHttpMethods.indexOf(event.request.clone().method) !== -1)
    return event.respondWith(fetch(event.request));

  return event.respondWith(new Promised((resolve) => {
    db.get(event.request.url).then((blobFound) => {
      if (!blobFound) {
        appFuncs.console('error')(`blob not found: ${event.request.url}`);
        if (!navigator.onLine) return appFuncs.fakeResponse();

        return fetch(event.request.clone())
          .then((response) => {
            if (!response || (response.type !== 'opaque' && !response.ok)) {
              appFuncs.console()(`received invalid response from fetch: ${response}`);
              appFuncs.console('dir')(response);

              return appFuncs.fakeResponse();
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
                appFuncs.console('error')(`blob size 0: ${blob}, ${event.request.url}`);

                return false;
              },
              (noBlob) => appFuncs.console()(`blob not generated from cloned response:${noBlob}`)
            );

            return resolve(response);
          })
          .catch((error) => {
            appFuncs.console('dir')(error);
            appFuncs.console()('got error');

            return null;
          });
      }
      // blob found logic
      const contentType = appFuncs.getBlobType(blobFound, event.request.url, event.request.headers);
      appFuncs.console()(`responding from cache: ${event.request.url}, contentType: ${contentType}, size: ${blobFound.size}`);

      const myHeaders = {};
      for ( const key of event.request.headers.entries())
        myHeaders[key[0]] = key[1];

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
