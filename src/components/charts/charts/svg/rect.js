import React from 'react';

export const Rect = ({
  className = 'rect',
  fill = 'blue',
  height = 200,
  width = 200,
  x = 0, // eslintignore x axis starting point of upper left corner
  y = 0, // eslintignore y axis starting point of upper left corner
}) =>
  <rect
    className={className}
    fill={fill}
    height={height}
    width={width}
    x={x}
    y={y}
  />
;

Rect.propTypes = {
  className: React.PropTypes.string,
  fill: React.PropTypes.string,
  height: React.PropTypes.number,
  width: React.PropTypes.number,
  x: React.PropTypes.number,
  y: React.PropTypes.number,
};

export default Rect;
