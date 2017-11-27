/* eslint-disable */

import axios from 'axios';

export const INIT = 'RXNORM_INIT';
export const SUCCESS = 'RXNORM_SUCCESS';
export const ERROR = 'RXNORM_ERROR';

export function rxNorm (type, data) {
  return {
    type,
    data
  };
}

export default function rxNormCycle (drugName, rxcui) {
  return function request (dispatch) {
    dispatch(rxNorm(INIT, new Map([
      [ 'status',
        {
          loading: true,
          error: false,
        }]
    ])));

    return axios.get(drugName
      ? `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drugName}`
      : `https://rxnav.nlm.nih.gov/REST/rxcui/${rxcui}/related?tty=IN+SCD+SBD`
    )
      .then((response) => dispatch(rxNorm(SUCCESS, new Map([
        [ drugName || rxcui, {...response.data}],
        [ 'status',
          {
            loading: false,
            error: false,
          }]
      ]))))
      .catch((error) => dispatch(rxNorm(ERROR, new Map([
        [ 'status',
          {
            loading: false,
            error: {...error},
          }]
      ]))));
  };
}
