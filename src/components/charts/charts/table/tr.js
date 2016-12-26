import React from 'react';

export const Tr = ({ fields, filterable, length, id, idx, th }) => {
  const cells = [];
  let i = 0;
  if (th && length && id && filterable)
    while (i < length) {
      cells.push(
        <th key={`${id}${i}`}>
          <input
            className={i === length - 1 ? 'flt_s' : 'flt'}
            id={`flt${i}_${id}`}
            onKeyUp={appFuncs.filterTable.Filter}
            type='text'
          />
        </th>
      );
      i++;
    }
  else if (fields.length && th)
    fields.forEach((field, i2) => {
      cells.push(<th key={`${field}${i2}`}>{field}</th>);
    });
  else if (!appFuncs._.isEmpty(fields))
    for (const field in fields)
      cells.push(<td key={`${id}${fields[field]}${idx}`}>{fields[field]}</td>);

  return (
    <tr>
      {cells}
    </tr>
  );
};

Tr.propTypes = {
  fields: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.object,
  ]),
  filterable: React.PropTypes.bool,
  id: React.PropTypes.string,
  idx: React.PropTypes.number,
  length: React.PropTypes.number,
  th: React.PropTypes.bool,
};

export default Tr;
