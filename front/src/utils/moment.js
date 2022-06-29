export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function convertDateToObject(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    day: date.getDay(),
    time: date.getTime(),
  };
}

class Moment {
  constructor(current = new Date()) {
    const { year, month, date, day, time } = convertDateToObject(current);
    this.year = year;
    this.month = month;
    this.date = date;
    this.day = day;
    this.time = time;
  }

  get weekDay() {
    return WEEK_DAYS[this.day];
  }

  isToday() {
    const today = new Moment(new Date());
    return this.month === today.month && this.date === today.date;
  }
}

export default Moment;

/**
 * @param {Date} date
 * @return {Moment[]}
 */
export function getMonth(date) {
  date = new Date(date.getTime());
  date.setDate(1);
  date.setDate(1 - date.getDay());

  const dates = [];
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(new Moment(date));
      date.setDate(date.getDate() + 1);
    }
    dates.push(week);
  }

  return dates;
}
