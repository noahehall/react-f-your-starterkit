const utility = {
  /**
  * available console types, dependent on env
  * @see https://developer.mozilla.org/en-US/docs/Web/API/Console
  * @method consoleTypes
  * @param  {String}     type   type of console request
  * @param  {boolean}     bypass whether to bypass environment check
  * @return {String|undefined} the requested console method or undefined
  */
  consoleTypes (type, bypass) {
    // permitted console logging in production
    const prod = {
      debug: 'debug',
      error: 'error',
      exception: 'exception',
      trace: 'trace',
    };

    // permitted console logging
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

    return !appConsts.isProd || bypass
      ? prod[type] || notprod[type]
      : prod[type];
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
    let thisType = this.consoleTypes(type, bypass);

    return !thisType
      ? (f) => {null}
      : console[thisType]
        ? console[thisType]
        : console.log;
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
}

export default utility;
