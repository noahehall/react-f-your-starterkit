import { Map } from 'immutable';

export function msg(state = Map({}), action) {
  //console.log('state',state,action);
  return action.type === 'UPDATE_MSG' && typeof action.text === 'string' ?
    action.text :
    state;
}
