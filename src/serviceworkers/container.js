/**
 * @file manages all service workers in the client
 * @author @noahedwardhall
 */

if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('./rootworker.js', {
    scope: './'
  })
    //.then(() => navigator.serviceWorker.ready)
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
else appFuncs.console('info', true)('Your browser does not offline apps :( try switching to chrome, firefox, or opera');
