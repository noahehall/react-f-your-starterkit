/* eslint-disable */

import React from 'react';
import ConceptProperties from './ConceptProperties';

export default function RelatedDrugs ({
  drugs,
  drugNames,
  getRxNorm,
}) {
  return drugNames.length
    ? drugNames.map((name, idx0) => {
      if (!drugs.has(name))
        return null;

      const {drugGroup: {conceptGroup = []}} = drugs.get(name);

      return (
        <div key={name}>
          <h4 style={{ textTransform: 'capitalize' }}>{name}</h4>
          {conceptGroup.map((drug, idx) => (
            <ConceptProperties
              drugs={drugs}
              getRxNorm={getRxNorm}
              idx={idx}
              key={`${name}${idx}`}
              name={name}
              properties={drug}
            />
          ))}
        </div>
      );
    })

    : <div> Please search </div>;
}
