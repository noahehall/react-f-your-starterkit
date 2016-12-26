import React from 'react';

export const Path = ({ // eslintignore https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path
  chartType = 'pie',
  d,
  fill = 'blue',
  id = '',
  stroke = 'gray',
}) => <path
  className={`${chartType}-path`}
  d={d}
  fill={fill}
  id={id}
  stroke={stroke}
/>;

Path.propTypes = {
  chartType: React.PropTypes.string,
  d: React.PropTypes.string.isRequired,
  fill: React.PropTypes.string,
  id: React.PropTypes.string,
  stroke: React.PropTypes.string,
};

export default Path;
