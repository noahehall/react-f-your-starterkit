/**
 * Universal Functions made available to the entire application
 * @see https://www.hacksparrow.com/global-variables-in-node-js.html
 * @author @noahehall
 * @type {Object}
 */
require('./constants.js');

import dom from './lib/dom.js';
import integrations from './lib/integrations.js';
import math from './lib/math.js';
import serviceWorkers from './lib/serviceworkers.js';
import time from './lib/time.js';
import utility from './lib/utility.js';

const appFuncs = {
  ...dom,
  ...integrations,
  ...math,
  ...serviceWorkers,
  ...time,
  ...utility,
}

/**
 * Set global variables on worker & main threads, else node
 * @type {[type]}
 */
const self = self || null;
if (!self) global.appFuncs = appFuncs;
else self.appFuncs = appFuncs;
