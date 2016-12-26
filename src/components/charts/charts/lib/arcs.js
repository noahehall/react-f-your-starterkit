import * as d3 from 'd3';

export const generateLabelArc = ({
  chartHeight = 200,
  chartWidth = 200,
  endAngle,
  startAngle,
}) => {
  if (isNaN(endAngle) || isNaN(startAngle))
    appFuncs.logError({
      data: [
        endAngle,
        startAngle,
      ],
      loc: __filename,
      msg: 'endAngle and startAngle must be valid variables in arcs.generateLabelArc(), attempting to return labelArc anyway',
    });

  return d3
    .arc()
    .endAngle(endAngle)
    .innerRadius(Math.min(chartHeight, chartWidth)) // eslintignore bigger number = smaller donut
    .outerRadius(Math.min(chartHeight, chartWidth)) // eslintignore bigger number = smaller pie
    .startAngle(startAngle);
};

// path generator
export const generateArcPath = ({
  chartHeight = 200,
  chartWidth = 200,
  cornerRadius = 1,
  endAngle,
  padAngle = 0.03,
  startAngle,
}) => {
  if (isNaN(startAngle) || isNaN(endAngle))
    appFuncs.logError({
      data: [
        endAngle,
        startAngle,
      ],
      loc: __filename,
      msg: 'endAngle and startAngle must be valid variables in arcs.generateArcPath(), attempting to return arcPath anyway',
    });

  return d3
    .arc()
    .cornerRadius(cornerRadius)
    .endAngle(endAngle)
    .innerRadius(Math.min(chartWidth, chartHeight)/8) // eslintignore bigger number = smaller donut
    .outerRadius(Math.min(chartWidth, chartHeight)/1.9) // eslintignore bigger number = smaller pie
    .padAngle(padAngle)
    .startAngle(startAngle);
};

/**
 * Returns an array of objects with data for each slice
 * @method generateArcs
 * @param  {[type]}     [sort=null] [description]
 * @return {[type]}     [description]
 */
export const generateArcs = ({
  data,
  sort = null,
  yValue = '',
}) => {
  if (appFuncs._.isEmpty(data) || !yValue)
    appFuncs.logError({
      data: [
        data,
        yValue,
      ],
      loc: __filename,
      msg: 'data and yValue must be valid variables in arcs.generateArcs(), attempting to return arcs anyway',
    });

  return d3
    .pie()
    .sort(sort)
    .value((d) => d[yValue])(data);
};
