import React from 'react';
import Tr from './tr.js';

export const Thead = ({ data0, filterable, id }) => {
  const theadKeys = Object.keys(data0);

  return (
    <thead>
      {filterable && <Tr filterable={filterable} id={id} length={theadKeys.length} th={true} />}
      <Tr fields={theadKeys} id={id} th={true} />
    </thead>
  );
};

Thead.propTypes = {
  data0: React.PropTypes.object,
  filterable: React.PropTypes.bool,
  id: React.PropTypes.string,
};


export default Thead;
