import React from 'react';
import Thead from './thead.js';
import Tbody from './tbody.js';

export const Table = ({ className, data, id, filterable, sortable }) => {
  let thisClassName = className
    ? className
    : '';
  if (sortable) thisClassName += ' sortable';

  return (
    <table className={thisClassName} id={id}>
      <Thead
        data0={data[0]}
        filterable={filterable}
        id={id}
      />
      <Tbody data={data} id={id} />
      <tfoot><tr><td /></tr></tfoot>
    </table>
  );
};

Table.propTypes = {
  className: React.PropTypes.string,
  data: React.PropTypes.array,
  filterable: React.PropTypes.bool,
  id: React.PropTypes.string,
  sortable: React.PropTypes.bool,
};

export default Table;
