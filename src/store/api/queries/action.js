/* eslint-disable */

export const QUERIES = 'QUERIES';

export function track (drugName, init) {
  return {
    type: QUERIES,
    drugName,
    init
  };
}

export default function queries (drugName, init) {
  return function tracker (dispatch) {
    dispatch(track(drugName, init));
  };
}
