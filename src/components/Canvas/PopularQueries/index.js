/* eslint-disable */
import React from 'react';

export default function PopularQueries ({searches, getRxNorm}) {
  return (
    <div>
      <h3>Popular Searches</h3>
      {
        searches
          .sort((entryA, entryB) => (entryB[1] - entryA[1]))
          .slice(0, 5)
          .map((entry) => (
            <div
              key={entry[0]}
              onClick={() => getRxNorm(true, entry[0])}
              style={{ cursor: 'pointer' }}
            >
              {entry[0]}: {entry[1]}
            </div>
          ))
      }
    </div>
  );
}
