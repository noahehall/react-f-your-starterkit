import React from 'react';
import * as arcs from './arcs.js';
import Text from '../svg/text.js';

export const getLabelText = ({
  arc = {},
  chartType = '',
  d = {},
  labels = [],
}) => {
  if (!labels.length || !chartType) {
    appFuncs.logError({
      data: [
        arc,
        chartType,
        d,
        labels,
      ],
      loc: __filename,
      msg: 'labels, chartType, and arc must be valid variables in labels.getLabelText(), returning empty string',
    });

    return '';
  }
  switch (chartType.toLowerCase()) {
    case 'pie': {
      if (appFuncs._.isEmpty(arc.data)) {
        appFuncs.logError({
          data: [
            arc,
            chartType,
            labels,
          ],
          loc: __filename,
          msg: 'arc.data must be a valid variable in labels.getLabelText(), returning empty string',
        });

        return '';
      }

      const label = [];
      labels.forEach((thisLabel, idx) =>
        label.push(
          <tspan className={'label'} key={`${thisLabel}-${idx}`}>
            {`${arc.data[thisLabel]}  `}
          </tspan>
        )
      );

      return label;
    }
    case 'scatterplot':
    case 'bar':
    case 'simple': {
      if (appFuncs._.isEmpty(d)) {
        appFuncs.logError({
          data: d,
          loc: __filename,
          msg: 'd must be a valid variable in labels.getLabelText(), returning empty string',
        });

        return '';
      }

      let thisLabel = '';
      labels.forEach((label) => thisLabel += `${d[label]} `);

      return thisLabel;
    }
    default: {
      appFuncs.logError({
        data: chartType,
        loc: __filename,
        msg: 'chartType not setup for labels.getLabelText() returning null',
      });

      return null;
    }
  }
};
getLabelText.propTypes = {
  arc: React.PropTypes.object,
  chartType: React.PropTypes.string,
  d: React.PropTypes.object,
  labels: React.PropTypes.array,
};

export const getPieLabels = ({ // eslint-disable-line
  arc = {},
  chartHeight = 200,
  chartWidth = 200,
  idx = 0,
  labels = [],
}) => {
  if (appFuncs._.isEmpty(arc) || !labels.length) {
    appFuncs.logError({
      data: arc,
      loc: __filename,
      msg: 'arc and labels must be a valid variable in labels.getPieLabels(), returning null',
    });

    return null;
  }

  const thisArc = arcs.generateLabelArc({
    chartHeight,
    chartWidth,
    endAngle: arc.endAngle,
    startAngle: arc.startAngle,
  });
  // tbd: automatic text sizing
  // appFuncs.console('dir')(this.text.getComputedTextLength());

  const
    [ x, y ] = thisArc.centroid(arc),
    dx = (arc.endAngle + arc.startAngle)/2 > Math.PI
      ? -15
      : 15,
    // wrap the text in svg tspan elements
    text = getLabelText({ arc, chartType: 'pie', labels });

  if (!text) {
    appFuncs.logError({
      data: [
        'chartType = pie',
        arc,
        labels,
      ],
      msg: 'text needs to be a valid variable, check labels.getLabelText method, returning empty string',
    });

    return '';
  }

  return (
    <Text
      chartType='pie'
      className=''
      dx={dx}
      dy={0}
      text={text}
      transform='rotate(0)'
      x={x/2}
      xlinkHref={`#arc-${idx}`}
      y={y/2}
    />
  );
};
getPieLabels.propTypes = {
  arc: React.PropTypes.object,
  chartHeight: React.PropTypes.number,
  chartWidth: React.PropTypes.number,
  idx: React.PropTypes.number,
  labels: React.PropTypes.array,
};

export const getLabels = ({
  arc = {},
  chartHeight = 200,
  chartType = '',
  chartWidth = 200,
  d,
  idx = 0,
  labels = [],
}) => {
  if (!chartType) {
    appFuncs.logError({
      data: [
        arc,
        chartType,
        d,
        labels,
      ],
      loc: __filename,
      msg: 'Chart type must be defined in labels.getLabels(), returning empty string',
    });

    return '';
  }
  switch (chartType.toLowerCase()) {
    case 'pie': return getPieLabels({
      arc,
      chartHeight,
      chartType,
      chartWidth,
      idx,
      labels,
    });
    default: {
      let label = '';
      labels.forEach((thisLabel) => label += `${d[thisLabel]} `);

      return label;
    }
  }
};
