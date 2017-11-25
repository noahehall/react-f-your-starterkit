/* eslint-disable */
// https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
import MemoryFS from "memory-fs";
const memoryFsSingleInstance = new MemoryFS();

global['FS'] = memoryFsSingleInstance;

var singleton = {};

Object.defineProperty(singleton, "instance", {
  get: function(){
    return global['FS'];
  }
});

Object.freeze(singleton);
export default (function getMemoryFsSingleInstance () {
  return singleton.instance;
})();
