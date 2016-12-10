/**
 * Universal Constants made available to entire application
 * @see https://www.hacksparrow.com/global-variables-in-node-js.html
 * @author @noahehall
 * @type {Object}
 */

const appConsts = {
  appVersion: 1, // non 0 integer, incremented by 1
  dbName: 'starterkit',
  initialStore: 'cache',
  isProd: process.env.NODE_ENV === 'production',
  nodeOnline: process.env.NODE_ONLINE === 'true',
  rollbarKeyClient: 'c62bfbd097b041b59b1f929d7b58abcc',
  rollbarKeyServer: '7cd7059f43ee40fe857f6ad9862a0304',
}

/**
 * Set global variables on worker & main threads, else node
 * @type {[type]}
 */
const self = self || null;
if (!self) global.appConsts = appConsts;
else self.appConsts = appConsts;
