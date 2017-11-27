/* eslint-disable */

import React from 'react';
import ReactTable from 'react-table';
import termTypes from './termTypes';

export default function RelatedTable ({related}) {
  const data = related.filter((obj) => obj.conceptProperties);

  const columns = [
    {
      Header: 'Type',
      accessor: 'tty',
      Cell (props) {
        return (
          <span>{termTypes[props.value]}</span>
        );
      }
    },
    {
      id: 'name',
      Header: 'Name',
      accessor (d) {
        return d.conceptProperties[0].synonym || d.conceptProperties[0].name;
      }
    }
  ];

  return (
    <ReactTable
      columns={columns}
      data={data}
      defaultPageSize={data.length}
      showPagination={false}
    />
  );
}
