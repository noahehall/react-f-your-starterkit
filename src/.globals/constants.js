/**
 * Universal Constants made available to entire application
 * @see https://www.hacksparrow.com/global-variables-in-node-js.html
 * @author @noahehall
 * @type {Object}
 */
import _ from 'lodash';
import Immutable from 'seamless-immutable';

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
const setAppConsts = (mergedConstants = Immutable(appConsts)) => {
  const self = self || null;
  // set node app consts
  if (!self && global && !global.appConsts) global.appConsts = mergedConstants;
  // set main & worker threads
  else if (self && !self.appConsts) self.appConsts = mergedConstants;

  return self && self.appConsts || global && global.appConsts
    ? true
    : false;
}

export default function setConstants({ yourConstants = {} }) {
  setAppConsts(Immutable(_.merge(
    appConsts,
    !_.isEmpty(yourConstants)
      ? yourConstants
      : {}
    )
  ));
}
