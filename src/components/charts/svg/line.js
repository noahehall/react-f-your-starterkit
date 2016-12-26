import React from 'react';

export const Line = ({
  x1 = 0, // eslintignore x axis start of line
  x2 = 100, // eslintignore x axis end of line
  y1 = 0, // eslintignore y axis start of line
  y2 = 100, // eslintignore y axis end of line
  style = {
    stroke: 'red',
    strokeWidth: 4,
  },
}) => <line
  style={style}
  x1={x1}
  x2={x2}
  y1={y1}
  y2={y2}
/>;

Line.propTypes = {
  style: React.PropTypes.object,
  x1: React.PropTypes.number,
  x2: React.PropTypes.number,
  y1: React.PropTypes.number,
  y2: React.PropTypes.number,
};

export default Line;
