import * as d3 from 'd3';
import * as d3chromatic from 'd3-scale-chromatic'; // eslintignore https://github.com/d3/d3-scale-chromatic
import * as label from './labels.js';

/**
 * create yscale
 * anywhere you need the Y dimension of the bar to scale to the viewport of the svg
 * first send it into this function e.g. below in the Height and Y properties
 */
export const yScale = ({
  chartHeight,
  chartType,
  dataMaxNumber,
  dataMinNumber,
}) => {
  if (!chartType) {
    appFuncs.logError({
      data: [ chartHeight, chartType, dataMinNumber, dataMaxNumber ],
      loc: __filename,
      msg: `chart type cannot be undefined for scales.yScale(), returning null`,
    });

    return null;
  }
  switch (chartType.toLowerCase()) {
    case 'pie': return null;
    case 'line':
    case 'scatterplot':
    case 'bar':
    default: {
      if (chartHeight < 0 || dataMaxNumber < 0) {
        appFuncs.logError({
          data: [ chartHeight, chartType, dataMaxNumber, dataMinNumber ],
          loc: __filename,
          msg: 'all values should be defined and above 0 for scales.yScale(), returning null',
        });

        return null;
      }

      return d3
        .scaleLinear()
        .domain([
          chartType === 'scatterplot'
            // -1 for scatterplot dots to always be above axis
            ? dataMinNumber - 1
            : 0,
          chartType === 'scatterplot'
            // +1 for scatterplot dots to always be below axis
            ? dataMaxNumber + 1
            : dataMaxNumber,
        ])
        .range([ chartHeight, 0 ]);
    }
  }
};

/**
 * retrieve xscale
 */
export const getYScale = ({
  // chartHeight = 200,
  chartDataGroupBy = '',
  chartType = '',
  data,
  // chartWidth = 200,
  margins = {},
  svgHeight = 200,
  yValue = '',
}) => {
  if (!yValue || !chartType || appFuncs._.isEmpty(data)) {
    appFuncs.logError({
      data: [ chartType, data, yValue ],

      msg: 'yValue, chartType and data need to be valid variables for scales.getYScale(), returning null',
    });

    return null;
  }

  let
    dataMaxNumber,
    dataMinNumber;

  // flatten if required
  let thisData = [];
  if (chartDataGroupBy)
    data.forEach((group) => thisData.push(...group.values));
  else thisData = data;

  switch (chartType.toLowerCase()) {
    case 'pie': return null;
    case 'line': // eslintignore both min and max
    case 'scatterplot': { // eslintignore both min and max
      try {
        dataMinNumber = appFuncs._.minBy(thisData, (o) => o[yValue])[yValue];
      } catch (err) {
        appFuncs.logError({
          data: [
            thisData,
            yValue,
          ],
          err,
          loc: __filename,
          msg: 'error creating dataMinNumber for scatterplot chart in scales.getYScale()',
        });
      }
    }
    case 'bar': // eslint-disable-line no-fallthrough
    default: {
      try {
        dataMaxNumber = appFuncs._.maxBy(thisData, (o) => o[yValue])[yValue];
      } catch (err) {
        appFuncs.logError({
          data: [
            thisData,
            yValue,
          ],
          err,
          loc: __filename,
          msg: 'error creating dataManNumber for bar chrt chart in scales.getYScale()',
        });
      }
    }
  }

  return yScale({
    chartHeight: svgHeight - (margins.top + margins.bottom),
    chartType,
    dataMaxNumber,
    dataMinNumber,
  });
};

/**
 * create xscale
 * anywhere you need the X dimension of the bar to scale to the viewport of the svg
 */
export const xScale = ({
  // chartHeight = 200,
  chartType = '',
  chartWidth = 200,
  dataLabelsArray = [],
  dataMinNumber,
  dataMaxNumber,
  xScaleTime,
}) => {
  if (!chartType) {
    appFuncs.logError({
      loc: __filename,
      msg: `chart type (${chartType}) needs to be a valid chart type for scales.xScale(), returning null`
    });

    return null;
  }

  if (xScaleTime)
    switch (chartType.toLowerCase()) {
      case 'line': {
        return d3
          .scaleTime()
          .domain([ dataMinNumber, dataMaxNumber ])
          .range([ 0, chartWidth ]);
      }
      default: {
        appFuncs.logError({
          loc: __filename,
          msg: `chartType ${chartType} not setup for xScaleTime in scales.xScale(), returning null`
        });

        return null;
      }
    }

  switch (chartType.toLowerCase()) {
    case 'pie': return null;
    case 'scatterplot': {
      return d3
        .scaleLinear()
        .domain([
          dataMinNumber > 0
            // -1 for scatterplot dots to always be above axis
            ? dataMinNumber - 1
            : 0,
          // +1 for scatterplot dots to always be below axis
          dataMaxNumber + 1
        ])
        .range([ 0, chartWidth ]);
    }
    case 'bar': {
      if (!dataLabelsArray.length)
        appFuncs.logError({
          data: [ chartType, dataLabaelsArray ],
          loc: __filename,
          msg: `dataLabaelsArray cannot be empty in scales.xScale(), attempting to create and return xScale anyway`,
        });

      return d3
        .scaleBand()
        .domain(dataLabelsArray)
        .rangeRound([ 0, chartWidth ])
        .paddingInner(0.1)
        .paddingOuter(0.5);
    }
    default: {
      appFuncs.logError({
        msg:`chartType ${chartType} is not setup for scale creation in scales.xScale(), returning null`
      });

      return null;
    }
  }
};

/**
 * retrieve xscale
 */
export const getXScale = ({
  chartDataGroupBy = '',
  chartType = '',
  data,
  labels,
  margins = {},
  svgWidth = 200,
  xValue,
  xScaleTime,
}) => { // eslint-disable-line consistent-return
  if (appFuncs._.isEmpty(data)) {
    appFuncs.logError({
      data: [
        chartType,
        data,
      ],
      loc: __filename,
      msg: `data must be a valid variable in scales.getXScale(), returning null`
    });

    return null;
  }
  const chartWidth = svgWidth - (margins.left + margins.right);

  let
    dataLabelsArray,
    dataMaxNumber,
    dataMinNumber;

  // flatten if required
  let thisData = [];
  if (chartDataGroupBy)
    data.forEach((group) => thisData.push(...group.values));
  else thisData = data;

  switch (chartType.toLowerCase()) {
    case 'pie': return null;
    case 'line': // eslintignore both min and max
    case 'scatterplot': { // eslintignore both min and max
      try {
        dataMaxNumber = appFuncs._.maxBy(thisData, (o) => o[xValue])[xValue];
      } catch (err) {
        appFuncs.logError({
          data: [
            thisData,
            xValue,
          ],
          err,
          loc: __filename,
          msg: 'error creating dataMaxNumber for scatterplot chart in scales.getXScale()',
        });
      }

      try {
        dataMinNumber = appFuncs._.minBy(thisData, (o) => o[xValue])[xValue];
      } catch (err) {
        appFuncs.logError({
          data: [
            thisData,
            xValue,
          ],
          err,
          loc: __filename,
          msg: 'error creating dataMixNumber for scatterplot chart in scales.getXScale()',
        });
      }

      break;
    }
    case 'bar': // eslint-disable-line
    default: {
      dataLabelsArray = thisData.map((d) => label.getLabels({ chartType, d, labels }));
    }
  }

  return xScale({
    chartType,
    chartWidth,
    dataLabelsArray,
    dataMaxNumber,
    dataMinNumber,
    xScaleTime,
  });
};

// Retrieve color scale
export const colorScale = ({
  colorScaleScheme = 'schemeCategory20',
  colorScaleType = 'basic'
}) => {
  switch (colorScaleType.toLowerCase()) {
    // update this:
    // https://github.com/d3/d3-scale/blob/master/README.md#category-scales
    case 'basic': {
      if (d3[colorScaleScheme])
        return d3.scaleOrdinal(d3[colorScaleScheme]);

      appFuncs.logError({
        data: [
          colorScaleScheme,
          colorScaleType,
        ],
        loc: __filename,
        msg: `Scheme ${colorScaleScheme} does not exist for Scale type ${colorScaleType}, returning default schemeCategory20`
      });

      return d3.scaleOrdinal(d3.schemeCategory20);
    }
    // update this:
    // https://github.com/d3/d3-scale-chromatic#categorical
    // https://github.com/d3/d3-scale-chromatic#diverging
    case 'chromatic': {
      if (colorScaleScheme && d3chromatic[colorScaleScheme])
        return d3.scaleOrdinal(d3chromatic[colorScaleScheme]);

      appFuncs.logError({
        data: [
          colorScaleScheme,
          colorScaleType,
        ],
        loc: __filename,
        msg: `Scheme ${colorScaleScheme} does not exist for Scale type ${colorScaleType}, returning ${schemeAccent}`
      });

      return d3.scaleOrdinal(d3chromatic.schemeAccent);
    }
    // update this
    // https://github.com/d3/d3/blob/master/API.md#sequential-scales
    case 'sequential': {
      return d3.scaleSequential(d3.interpolatePiYG);
    }
    // update this: https://github.com/d3/d3/blob/master/API.md#sequential-scales
    case 'random':
    default: {
      appFuncs.logError({
        data: [
          colorScaleScheme,
          colorScaleType,
        ],
        loc: __filename,
        msg: `Scheme ${colorScaleScheme} does not exist for Scale type ${colorScaleType}, returning ${interpolateCool}`
      });

      return d3.interpolateCool;
    }
  }
};
