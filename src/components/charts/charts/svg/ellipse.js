import React from 'react';

export const Ellipse = ({
  cx = 200, // eslintignore x axis center of element, relative to upper left
  cy = 80, // eslintignore y axis center of element, relative to upper left
  rx = 100, // eslintignore x radius of element
  ry = 50, // eslintignore y radius of element
  style = {
    fill: 'blue',
    stroke: 'black',
    strokeWidth: 3,
  },
}) => <ellipse
  cx={cx}
  cy={cy}
  rx={rx}
  ry={ry}
  style={style}
/>;

Ellipse.propTypes = {
  cx: React.PropTypes.number,
  cy: React.PropTypes.number,
  rx: React.PropTypes.number,
  ry: React.PropTypes.number,
  style: React.PropTypes.object,
};

export default Ellipse;
