import { Bars } from './barchart/bars.js';
import { Lines } from './linechart/lines.js';
import { PieSlices } from './piechart/slices.js';
import { ScatterPlotDots } from './scatterplot/dots.js';
import { SVG } from './svg';
import * as axes from './lib/axes.js';
import * as dataFunctions from './lib/data.js';
import * as scales from './lib/scales.js';
import React from 'react';
import { Table } from './table';

export const getVisualContainerTransform = ({
  chartHeight,
  chartType,
  chartWidth,
}) => {
  switch(chartType.toLowerCase()) {
    case 'pie': return `translate(${[ chartWidth/2, chartHeight/2 ]})`;
    default : return 'translate(0, 0)';
  }
};

export const Chart = ({
  chart = { data: {}, margins: {}},
  chartDataGroupBy = '', // eslintignore required for line chart
  // bar|scatterplot|pie|line
  // scatterplot: requires x and y values to be integers
  chartType = '',
  colorScaleScheme = '',
  colorScaleType = '',
  containerHeight = 200,
  containerWidth = 200,
  datumLabels = [],
  filterable = false,
  id = '',
  margins = { },
  preserveAspectRatio = 'xMinYMin meet',
  sortable = false,
  xAxis = false,
  xAxisLabel = '',
  xScale = false,
  xScaleTime = false, // eslintignore required for line chart
  xScaleTimeFormat = '', // eslintignore required for line chart https://github.com/d3/d3-time-format/blob/master/README.md#locale_format
  xValue = '',
  yAxis = false,
  yAxisLabel = '',
  yScale = false,
  yValue = '', // eslintignore used for pie chart slice arc
}) => {
  if (appFuncs._.isEmpty(chart.data)) {
    appFuncs.logError({
      data: chart,
      loc: __filename,
      msg: 'You need data to create a chart, return null',
    });

    return null;
  }

  let chartFunction;
  switch (chartType.toLowerCase()) {
    case 'pie':
      chartFunction = PieSlices;
      break;
    case 'bar':
      chartFunction = Bars;
      break;
    case 'scatterplot':
      chartFunction = ScatterPlotDots;
      break;
    case 'line':
      chartFunction = Lines;
      break;
    case 'table':
      chartFunction = Table;
      break;
    default : {
      appFuncs.logError({
        data: [ chartType, chart ],
        loc: __filename,
        msg: `did not find chart type ${chartType}, returning null`,
      });

      return null;
    }
  }

  const
    chartHeight = containerHeight - (margins.top + margins.bottom),
    chartWidth = containerWidth - (margins.left + margins.right),
    colorScale = colorScaleScheme
      ? scales.colorScale({ chartDataGroupBy, colorScaleScheme, colorScaleType })
      : null,
    data = dataFunctions.format({
      chartDataGroupBy,
      chartType,
      data: chart.data,
      xScaleTime,
      xScaleTimeFormat,
      xValue,
    }),
    hasDocument = typeof document !== 'undefined',
    thisXAxisLabel = xAxis
      ? axes.getXAxisLabel({
        chartDataGroupBy,
        transform: 'rotate(0)',
        x: containerWidth / 2 - margins.left,
        xAxisLabel: xAxisLabel || xValue,
        y: containerHeight,
      })
      : null,
    thisXScale = xScale
      ? scales.getXScale({
        chartDataGroupBy,
        chartHeight,
        chartType,
        chartWidth,
        data,
        labels: datumLabels,
        margins,
        svgWidth: containerWidth,
        xScaleTime,
        xScaleTimeFormat,
        xValue,
      })
      : null,
    thisYAxisLabel = yAxis
      ? axes.getYAxisLabel({
        chartDataGroupBy,
        transform: 'rotate(-90)',
        // x & y flip because of rotation
        x: -containerHeight / 2 - margins.top,
        y: '1em',
        yAxisLabel: yAxisLabel || yValue,
      })
      : null,
    thisYScale = yScale
      ? scales.getYScale({
        chartDataGroupBy,
        chartHeight,
        chartType,
        chartWidth,
        data,
        margins,
        svgHeight: containerHeight,
        yValue,
      })
      : null;

  if (yAxis && thisYScale && hasDocument) axes.getYAxis({ id, thisYScale });
  if (xAxis && thisXScale && hasDocument) axes.getXAxis({ id, thisXScale });

  const thisChart = chartFunction({
    chartDataGroupBy,
    chartHeight,
    chartType,
    chartWidth,
    colorScale,
    colorScaleScheme,
    colorScaleType,
    data,
    filterable,
    id,
    labels: datumLabels,
    sortable,
    xScale: thisXScale,
    xScaleTime,
    xScaleTimeFormat,
    xValue,
    yScale: thisYScale,
    yValue,
  });

  return chartType === 'table'
    ? thisChart
    : <SVG
      id={id}
      preserveAspectRatio={preserveAspectRatio}
      svgHeight={containerHeight}
      svgWidth={containerWidth}
    >
      <g
        className='chart-svg-g'
        height={chartHeight}
        transform={`translate(${margins.left}, ${margins.top})`}
        width={chartWidth}
      >
        <g
          className={`${chartType.toLowerCase()}-visual-container`}
          transform={getVisualContainerTransform({ chartHeight, chartType, chartWidth })}
        >
          {thisChart}
        </g>
      </g>
      { xAxis &&
        <g
          className='x axis'
          transform={`translate(${margins.left}, ${chartHeight + margins.top})`}
        />
      }
      { thisXAxisLabel }
      { yAxis &&
        <g
          className='y axis'
          transform={`translate(${margins.left}, ${margins.top})`}
        />
      }
      { thisYAxisLabel }
      <section
        id={`${id}-tooltip`}
        style={{
          backgroundColor: 'black',
          border: '2px red dashed',
          borderRadius: '4px',
          opacity: 0,
          padding: '10px',
          position: 'absolute',
        }}
      />
    </SVG>;
};

Chart.propTypes = {
  chart: React.PropTypes.object,
  chartDataGroupBy: React.PropTypes.string,
  chartType: React.PropTypes.string,
  colorScaleScheme: React.PropTypes.string,
  colorScaleType: React.PropTypes.string,
  containerHeight: React.PropTypes.number,
  containerWidth: React.PropTypes.number,
  datumLabels: React.PropTypes.array,
  filterable: React.PropTypes.bool,
  id: React.PropTypes.string,
  margins: React.PropTypes.object,
  preserveAspectRatio: React.PropTypes.string,
  sortable: React.PropTypes.bool,
  xAxis: React.PropTypes.bool,
  xAxisLabel: React.PropTypes.string,
  xScale: React.PropTypes.bool,
  xScaleTime: React.PropTypes.bool,
  xScaleTimeFormat: React.PropTypes.string,
  xValue: React.PropTypes.string,
  yAxis: React.PropTypes.bool,
  yAxisLabel: React.PropTypes.string,
  yScale: React.PropTypes.bool,
  yValue: React.PropTypes.string,
};

export default Chart;
