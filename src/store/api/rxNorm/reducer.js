import {
  INIT,
  SUCCESS,
  ERROR
} from './action';

export default function rxNorm (state = {}, action) {
  switch (action.type) {
    case SUCCESS:
    case INIT:
    case ERROR:
      return new Map([
        ...state,
        ...action.data,
      ]);

    default: return state;
  }
}
