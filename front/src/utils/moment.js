export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function convertDateToObject(date) {
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

  isToday() {
    const today = new Moment(new Date());
    return (
      this.getMonth() === today.getMonth() && this.getDate() === today.getDate()
    );
  }

  addMonth(number) {
    const date = new Date(this.getTime());
    date.setMonth(date.getMonth() + number);
    this.initMoment(date);
  }

  getYear() {
    return this.year;
  }

  getMonth() {
    return this.month;
  }

  getDate() {
    return this.date;
  }

  getTime() {
    return this.time;
  }

  getDay() {
    return this.day;
  }

  getWeekDay() {
    return WEEK_DAYS[this.day];
  }

  toString() {
    return {
      year: this.year,
      month: this.month,
      date: this.date,
      day: this.day,
      weekDay: this.getWeekDay(),
      time: this.time,
    };
  }
}

export default Moment;

/**
 * @param {Date} date
 * @return {Moment[]}
 */
export function calculateByMonth(date) {
  date = new Date(date.time);
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
