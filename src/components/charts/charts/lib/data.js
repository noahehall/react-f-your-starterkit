import * as time from './time.js';

export const formatTime = ({
  data,
  timeProperty = '',
  xScaleTimeFormat = '',
}) => {
  if (!timeProperty || !xScaleTimeFormat || appFuncs._.isEmpty(data)) {
    appFuncs.logError({
      data: [ data, timeProperty, xScaleTimeFormat ],
      loc: __filename,
      msg: 'timeProperty and xScaleTimeFormat must be valid variables in data.formatTime(), returning data without transformations',
    });

    return data;
  }
  const parseTime = time.parse({ format: xScaleTimeFormat });
  const transformed = [];

  data.forEach((group) =>
    transformed.push({
      ...group,
      [timeProperty]: parseTime(group[timeProperty]),
    })
  );

  return transformed;
};

export const groupBy = ({
  chartDataGroupBy = '',
  data,
  xScaleTime,
  xScaleTimeFormat,
  xValue = '',
}) => {
  if (appFuncs._.isEmpty(data) || !chartDataGroupBy) {
    appFuncs.logError({
      data: [ chartDataGroupBy, data ],
      loc: __filename,
      msg: 'data and chartDataGroupBy must be valid variables in data.groupBy(), returning data without transformations',
    });

    return data;
  }
  // group all values by groupby
  const dataValues = appFuncs._.groupBy(data, (d) => d[chartDataGroupBy]);

  if (appFuncs._.isEmpty(dataValues)) {
    appFuncs.logError({
      data: [ data, dataValues ],
      loc: __filename,
      msg: `could not create groups for data on key ${chartDataGroupBy}, returning data`,
    });

    return data;
  }

  // create object with values and keys for each lineValues group
  const dataGroups = Object.keys(dataValues).map((key) => {
    let transformed = [];

    // transform time if required
    if (xScaleTime && xScaleTimeFormat)
      transformed = formatTime({
        data: dataValues[key],
        timeProperty: xValue,
        xScaleTimeFormat,
      });

    return {
      id: key,
      values: transformed.length
        ? transformed
        : dataValues[key],
    };
  });

  return dataGroups;
};

export const format = ({
  chartDataGroupBy = '',
  chartType = '',
  data,
  xScaleTime = false,
  xScaleTimeFormat = '',
  xValue = '',
}) => {
  if (appFuncs._.isEmpty(data)) return data;

  switch (chartType.toLowerCase()) {
    case 'table':
    case 'line':
    case 'scatterplot':
    case 'bar':
    case 'pie':
    default: {
      // Group data and return
      if (chartDataGroupBy)
        return groupBy({
          chartDataGroupBy,
          data,
          xScaleTime,
          xScaleTimeFormat,
          xValue,
        });

      // transform time and return
      if (xScaleTime && xScaleTimeFormat)
        return formatTime({
          data,
          timeProperty: xValue,
          xScaleTimeFormat,
        });

      return data;
    }
  }
};
