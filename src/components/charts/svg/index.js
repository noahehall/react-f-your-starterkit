import React from 'react';

export const SVG = ({
  children,
  id = 'chart',
  preserveAspectRatio = 'xMinYMin meet',
  svgHeight = 200,
  svgWidth = 200,
}) =>
  <svg
    className='chart-svg'
    id={id}
    preserveAspectRatio={preserveAspectRatio}
    style={{
      display: 'block',
      position: 'relative',
    }}
    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    xmlns='http://www.w3.org/2000/svg'
  >
    {children}
  </svg>;

SVG.propTypes = {
  children: React.PropTypes.node,
  id: React.PropTypes.string,
  preserveAspectRatio: React.PropTypes.string,
  svgHeight: React.PropTypes.number,
  svgWidth: React.PropTypes.number,
};

export default SVG;
