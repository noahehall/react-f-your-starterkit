/* eslint-disable */
// require('../../.globals/');
// import Immutable from 'seamless-immutable';

export default function blah (state = {}, action) {
  switch (action.type) {
    case 'BLAH':
      return action.data;

    default:
      return state;
  }
}
