import Moment from 'moment';
require("moment-duration-format");

const time = {

  getTodaysDate () {
    return Moment().format("YYYY-MM-DD");
  },

  getRightNowTime () {
    return Moment().format("HH:mm");
  },

  getDateTimeLocalFormat () {
    return 'YYYY-MM-DDThh:mm';
  },

  getDateFormat () {
    return 'YYYY-MM-DD';
  },

  getTimeFormat () {
    return 'HH:mm';
  },
  getDuration ({ startTime, startDate, endTime, endDate }) {
    const duration = Math.abs(Moment(`${endDate} ${endTime}`, 'MM/DD/YYYY h:mm+a') - Moment(`${startDate} ${startTime}`, 'MM/DD/YYYY h:mm+a'));

    return Moment.duration(duration).format("h [hrs], m [min]");
  },
}

export default time;
