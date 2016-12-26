import React from 'react';

export const Text = ({
  chartType = '',
  className = '',
  dx = 0, // eslintignore x offset from current position
  dy = 0, // eslintignore y offset from current position
  fill = 'black',
  text = '',
  transform = 'rotate(20, 30, 40)',
  x = 0, // eslintignore relative to upper left
  y = 20, // eslintignore relative to upper left
}) => {
  if (!text.length || !chartType) {
    appFuncs.logError({
      data: [
        chartType,
        dx,
        dy,
        fill,
        text,
        transform,
        x,
        y,
      ],
      msg: 'text must be a valid variable in svg/text.js, returning null',
    });

    return null;
  }

  const thisClassName = `${className} ${chartType} labels`.trim();

  return (
    <text
      className={thisClassName}
      dx={dx}
      dy={dy}
      fill={fill}
      transform={transform}
      x={x}
      y={y}
    >
      {text}
    </text>
  );
};

Text.propTypes = {
  chartType: React.PropTypes.string,
  className: React.PropTypes.string,
  dx: React.PropTypes.number,
  dy: React.PropTypes.number,
  fill: React.PropTypes.string,
  text: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string,
  ]),
  transform: React.PropTypes.string,
  x: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
  y: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
  ]),
};

export default Text;
