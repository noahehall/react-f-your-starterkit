import React from 'react';
import Tr from './tr.js';

export const Tbody = ({ data, id }) => {
  const rows = [];
  data.forEach((datum, idx) => rows.push(<Tr
    fields={datum}
    id={id}
    idx={idx}
    key={`row${id}${idx}`}
  />));

  return (
    <tbody>
      {rows}
    </tbody>
  );
};

Tbody.propTypes= {
  data: React.PropTypes.array,
  id: React.PropTypes.string,
};

export default Tbody;
