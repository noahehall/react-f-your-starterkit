/* eslint-disable */
// require('../../.globals/');
// import Immutable from 'seamless-immutable';

export default function blah (state = {}, action) {
  console.log('LSDFSDFSDFsdfsdfdsf')
  switch (action.type) {
    case 'BLAH':
      return Object.assign({}, state, {
        blah: action.data
      });

    default:
      return state;
  }
}
