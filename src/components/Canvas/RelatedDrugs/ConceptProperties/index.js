/* eslint-disable */

import React from 'react';
import RelatedTable from './RelatedTable';

export default function ConceptProperties ({
  properties,
  name,
  idx,
  getRxNorm,
  drugs,
}) {
  const { conceptProperties = [] } = properties;

  return conceptProperties.length
    ? (<ul>
      {conceptProperties.map((props) =>
        <li key={props.rxcui}>
          <h4
            onClick={() => getRxNorm(false, props.rxcui)}
            style={{ cursor: 'pointer '}}
          >
            {props.synonym || props.name}
          </h4>
          <div>
            {
              drugs.has(props.rxcui) &&
                <RelatedTable
                  related={drugs.get(props.rxcui).relatedGroup.conceptGroup}
                />
            }
          </div>
        </li>
      )}
    </ul>
    )
    : null;
}
