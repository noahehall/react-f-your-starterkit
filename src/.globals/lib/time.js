import Moment from 'moment';
require("moment-duration-format");

/**
 * formats and returns time in format required by bart API
 * @method getBartTime
 * @param  {[type]}    time [description]
 * @return {[type]}    [description]
 */
export const getBartTime = (time) =>
  time && Moment(time.trim()).format('MM/DD/YYYY h:mm+a').trim();
export const getTodaysDate = () => Moment().format("YYYY-MM-DD");
export const getRightNowTime = () => Moment().format("HH:mm");
export const getDateTimeLocalFormat = () => 'YYYY-MM-DDThh:mm';
export const getDateFormat = () => 'YYYY-MM-DD';
export const getTimeFormat = () => 'HH:mm';
export const getDuration = ({ startTime, startDate, endTime, endDate }) => {
  const duration = Math.abs(Moment(`${endDate} ${endTime}`, 'MM/DD/YYYY h:mm+a') - Moment(`${startDate} ${startTime}`, 'MM/DD/YYYY h:mm+a'));

  return Moment.duration(duration).format("h [hrs], m [min]");
};
export const moment = Moment;
