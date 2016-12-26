import { Path } from '../svg/path.js';
import * as arcs from '../lib/arcs.js';
import * as label from '../lib/labels.js';
import React from 'react';

export const PieSlices = ({
  chartHeight = 200,
  chartWidth = 200,
  colorScale,
  data,
  labels = [],
  yValue = '',
}) => {
  if (appFuncs._.isEmpty(data) || !yValue || !labels.length || !colorScale) {
    appFuncs.logError({
      data: [
        colorScale,
        data,
        labels,
        yValue,
      ],
      loc: __filename,
      msg: 'colorScale, labels, data and yValue must be valid variables in slices.PieSlices(), returning null',
    });

    return null;
  }

  const arcData = arcs.generateArcs({
    data,
    sort: null,
    yValue,
  });

  const arcArray = [];

  arcData.forEach((arc, idx) => {
    const thisArc = arcs.generateArcPath({
      chartHeight,
      chartWidth,
      endAngle: arc.endAngle,
      startAngle: arc.startAngle,
    });

    const labelText = label.getLabelText({ chartType: 'simple', d: arc.data, labels });

    if (!labelText.length)
      appFuncs.logError({
        data: labelText,
        loc: __filename,
        msg: 'labelText has 0 length in slices.PieSlices()',
      });

    arcArray.push(
      <g
        className='pie-slice'
        key={`${labelText.replace(/\s+/g, '-').toLowerCase()}${idx}`}
      >
        <Path
          d={thisArc()}
          fill={colorScale(idx)}
          id={`arc-${idx}`}
        />
        {
          label.getLabels({
            arc,
            chartHeight,
            chartType: 'pie',
            chartWidth,
            idx,
            labels,
          })
        }
      </g>
    );
  });

  return arcArray;
};
