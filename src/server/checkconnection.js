function checkInternet (cb) {
  if (typeof require !== 'undefined')
    return require('dns').lookup('google.com', (err) => {
      if (err && err.code === "ENOTFOUND") return cb(false);

      return cb(true);
    });

  return () => null;
}

checkInternet((isConnected) => {
  if (isConnected) {
    console.log('node is online'); // eslint-disable-line

    return true;
  }

  console.log('node is not online'); // eslint-disable-line

  return false;
});

if (typeof module !== 'undefined') module.exports.checkInternet = checkInternet;
