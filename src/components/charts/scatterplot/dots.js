import { Circle } from '../svg/circle.js';
import * as label from '../lib/labels.js';
import React from 'react';

export const ScatterPlotDots = ({
  chartType = 'scatterplot',
  className = 'dot',
  colorScale,
  data = [],
  labels = [],
  r = 3.5,
  xValue,
  yValue,
  xScale,
  yScale,
}) => {
  if (!yScale || !xScale || !xValue || !yValue) return null;
  const dots = [];
  data.forEach((d, i) => {
    const labelText = label.getLabelText({ chartType, d, labels });

    dots.push(
      <g className={className} key={`${labelText.replace(/\s+/g, '-').toLowerCase()}${i}`}>
        <Circle
          className='circle'
          cx={xScale(d[xValue])}
          cy={yScale(d[yValue])}
          fill={colorScale(i)}
          r={r}
        />
      </g>
    );
  });

  return dots;
};
