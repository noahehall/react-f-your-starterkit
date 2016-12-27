/**
 * Universal Constants made available to entire application
 * @see https://www.hacksparrow.com/global-variables-in-node-js.html
 * @author @noahehall
 * @type {Object}
 */

const appConsts = {
  appVersion: Number(process.env.APP_VERSION) || null,
  dbName: process.env.IDB_NAME || null,
  initialStore: process.env.INITIAL_IDB_STORE || null,
  idb: Number(process.env.APP_VERSION) && process.env.IDB_NAME && process.env.INITIAL_IDB_STORE,
  isProd: process.env.NODE_ENV === 'production',
  nodeOnline: process.env.NODE_ONLINE === 'true',
  rollbarKeyClient: process.env.ROLLBAR_CLIENT_KEY || null,
  rollbarKeyServer: process.env.ROLLBAR_SERVER_KEY || null,
}

/**
 * Set global variables on worker & main threads, else node
 * @type {[type]}
 */
const self = self || null;
if (!self) global.appConsts = appConsts;
else self.appConsts = appConsts;
