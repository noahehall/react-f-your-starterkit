// require('../../.globals/');
import Immutable from 'seamless-immutable';

export function msg (state = Immutable({}), action) {
  return action.type === 'UPDATE_MSG' && typeof action.text === 'string' ?
    Immutable({ ...state, msg: action.text }) :
    state;
}
