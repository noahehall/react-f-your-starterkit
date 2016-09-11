require('babel-register');
require('ignore-styles');

//jsdom
var jsdom = require('jsdom').jsdom;
var exposedProperties = ['window', 'navigator', 'document'];
global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});
global.navigator = {
  userAgent: 'node.js'
};
documentRef = document;

//testing
var chai = require('chai');
global.expect = chai.expect;
chai.should();
chai.use(require('sinon-chai'));
global.sinon = require('sinon');
