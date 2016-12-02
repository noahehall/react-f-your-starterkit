/**
 * @file manages all service workers in the client
 * @author @noahedwardhall
 */
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope
// https://serviceworke.rs/
// https://github.com/MicheleBertoli/react-worker/blob/master/public/worker.js
if ('serviceWorker' in navigator) {
  // navigator.serviceWorker === https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer
  navigator.serviceWorker.register('./rootworker.js', {
    scope: './'
  })
  // registration was successful
    .then((reg) => {
      if (reg.installing) {
        const sw = reg.installing;
        sw.postMessage(`installed worker message`);
        appFuncs.console()(`state is installing ${JSON.stringify(sw)}`);
      } else if (reg.waiting) {
        const sw = reg.waiting;
        appFuncs.console()(`state is waiting ${JSON.stringify(sw)}`);
      }

    // reg.installing is now the current worker
      reg.addEventListener('updatefound', () => {
      // whenever sw.state changes
        reg.installing.addEventListener('statechange', () => {
          if (reg.state === 'installed')
            appFuncs.console()(`please refresh your browser! ${JSON.stringify(reg)}`);
        });
      });
    })
  // registration failed
    .catch((error) => {
      appFuncs.console('error')(`Registration failed: ${error}`);
    });

  // the controlling service worker has changed
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    appFuncs.console()('controller has changed, reload');
    // reload the page if the user has consented, if not ask for permission
    // for some changes (e.g. minor, or security fixes) you may want to force changes to users
    window.location.reload();
  });
} else appFuncs.console('Your browser does not offline apps :( try switching to chrome, firefox, or opera)', 'info');
