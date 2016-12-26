import { createSelector } from 'reselect';

export const data = (state) => state.data;

/*
export const getNewIssues = createSelector(
  [data],
  (thisData) => thisData.newIssues
);
*/

// https://github.com/reactjs/reselect#sharing-selectors-with-props-across-multiple-components
export const getMargins = () =>
  createSelector(
    [data],
    (thisData) => thisData.margins
  );
