/**
 * Functions made available to the entire application
 * @see https://www.hacksparrow.com/global-variables-in-node-js.html
 * @author @noahehall
 * @type {Object}
 */
require('./constants.js');

import * as math from './lib/math';
import * as time from './lib/time';
import * as dom from './lib/dom';

const uncategorized = {
  getBlobType (blob, url) {
    return url.includes('http://fonts.googleapis.com/css') ?
      // http://stackoverflow.com/questions/2871655/proper-mime-type-for-fonts
      'text/css' :
        url.includes('https://travis-ci.org/noahehall/udacity-trainschedule.svg') ?
          'image/svg+xml' :
            blob.type ?
              blob.type :
                'text/html';
  },

  /**
  * available console types, dependent on env
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Console
  * @method consoleTypes
  * @param  {String}     type   type of console request
  * @param  {boolean}     bypass whether to bypass environment check
  * @return {String|undefined} the requested console method or undefined
  */
  consoleTypes (type, bypass) {
    const prod = {
      debug: 'debug',
      error: 'error',
      exception: 'exception',
      trace: 'trace',
    };

    const notprod = {
      assert: 'assert',
      clear: 'clear',
      count: 'count',
      dir: 'dir',
      dirxml: 'dirxml',
      group: 'group',
      groupCollapsed: 'groupCollapsed',
      groupEnd: 'groupEnd',
      info: 'info',
      log: 'log',
      profile: 'profile',
      profileEnd: 'profileEnd',
      table: 'table',
      time: 'time',
      timeEnd: 'timeEnd',
      timeStamp: 'timeStamp',
      warn: 'warn',
    };

    return bypass || !appConsts.isProd ?
      notprod[type] || prod[type] :
      prod[type];
  },

  /**
  * consoles data dependent on env
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Console
  * @method console
  * @param  {*}    data something to console
  * @param  {String}    [type='log']   console method to use
  * @param  {Boolean}   [bypass=false] should we bypass env check
  * @return {Function} console.method, console.log, or null function
  */
  console (type = 'log', bypass = false) {
    const thisType = this.consoleTypes(type, bypass);

    if (thisType) {
      if (console[thisType]) return console[thisType]; // eslint-disable-line no-console
      if (console.log) return console.log; // eslint-disable-line no-console
    }

    return (f) => {null};
  },

  rollbar (type = 'reportMessage') {
    if (typeof XMLHttpRequest !== undefined) {

      if (!this.rb) {
        this.rb = require('rollbar');
        this.rb.init(appConsts.rollbarKey);
      }

      if (this.rb[type]) return this.rb[type];
    }

    return (f) => {null};
  },

  /**
   * gets the unique values from an array
   * @method uniqueArray
   * @param {Array} [array=[]] non empty array
   * @returns {Array} filled with unique values
   */
  uniqueArray (array = []) {
    return Array.isArray(array) && array.length ?
     [...new Set(array)] :
     [];
  },

  fakeResponse() {
    return new Response(new Blob(), {
      "status" : 500 , "statusText" : "Sorry, you need to connect to the internet!"
    });
  }
}

const appFuncs = {
  ...uncategorized,
  ...math,
  ...time,
  ...dom,
}
/**
 * Set global variables on worker & main threads, else node
 * @type {[type]}
 */
const self = self || null;
if (!self) global.appFuncs = appFuncs;
else self.appFuncs = appFuncs;
