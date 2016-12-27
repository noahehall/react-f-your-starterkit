/**
 * @file checkconnection.js
 * @description Function for determining if node has access to the internet, original function adapted from stackoverflow http://stackoverflow.com/questions/15270902/check-for-internet-connectivity-in-nodejs user @jaruba
 * @author @noahedwardhall
 */
// require('../.globals');

function checkInternet (cb) {
  if (typeof require !== 'undefined')
    return require('dns').lookup('google.com', (err) => {
      if (err && err.code === "ENOTFOUND") return cb(false);

      return cb(true);
    });

  return () => null;
}

checkInternet((isConnected) => {
  if (isConnected) return true;

  return false;
});

if (typeof module !== 'undefined') module.exports.checkInternet = checkInternet;
