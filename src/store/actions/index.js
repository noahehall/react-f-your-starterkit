// import axios from 'axios';
// import { parseString } from 'xml2js';
require('../../.globals/');
export function updateMsg (text) {
  return {
    text,
    type: 'UPDATE_MSG'
  };
}
