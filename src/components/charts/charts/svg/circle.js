import React from 'react';

export const Circle = ({
  className = 'circle',
  cx = 50, // eslintignore x axis center of circle relative to upper left
  cy = 50, // eslintignore y axis center of circle relative to upper left
  fill = 'blue',
  r = 50, // eslintignore radius of circle
}) => <circle
  className={className}
  cx={cx}
  cy={cy}
  fill={fill}
  r={r}
/>;

Circle.propTypes = {
  className: React.PropTypes.string,
  cx: React.PropTypes.number,
  cy: React.PropTypes.number,
  fill: React.PropTypes.string,
  r: React.PropTypes.number,
};

export default Circle;
