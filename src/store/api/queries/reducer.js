/* eslint-disable */

import {
  QUERIES
} from './action';

// https://github.com/callemall/material-ui/issues/7195#issuecomment-314547601
import store from 'store-npm';

export default function queries (state = {}, action) {
  switch (action.type) {
    case QUERIES:
      if (action.init) return action.drugName;

      const prev = state[action.drugName] || 0;
      const queries = Object.assign(
        {},
        {...state},
        {[action.drugName]: prev + 1},
      );

      store.set('queries', queries);

      return queries;

    default: return state;
  }
}
