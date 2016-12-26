import { Rect } from '../svg/rect';
import React from 'react';
import * as label from '../lib/labels.js';

export const Bars = ({
  chartHeight = 200,
  colorScale,
  data,
  labels,
  yValue = '',
  xScale,
  yScale,
}) => {
  if (!yScale || !xScale || !yValue) {
    appFuncs.logError({
      data: [
        xScale,
        yScale,
        yValue,
      ],
      loc: __filename,
      msg: 'yScale, yValue and xScale must be valid variables in Bars(), returning null',
    });

    return null;
  }
  const rects = [];
  data.forEach((d, i) => {
    // this is required for tick marks
    const labelText = label.getLabelText({ chartType: 'bar', d, labels });
    rects.push(
      <g className='bar' key={`${labelText.replace(/\s+/g, '-').toLowerCase()}${i}`}>
        <Rect
          className='rect'
          fill={colorScale(i)}
          height={chartHeight - yScale(d[yValue])}
          width={xScale.bandwidth()}
          // `i * (barWidth + barOffset)` if you're not using scaleBands
          x={xScale(labelText)}
          y={yScale(d[yValue])}
        />
      </g>
    );
  });

  return rects;
};

export default Bars;
