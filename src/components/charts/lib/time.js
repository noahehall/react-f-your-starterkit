import * as d3 from 'd3';

export const parse = ({
  format = '',
}) => {
  if (!format) {
    appFuncs.logError({
      data: format,
      loc: __filename,
      msg: 'format must be valid variables in time.parse(), returning null',
    });

    return null;
  }

  return d3.timeParse(format);
};
