export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function Today() {
  let today = new Date();
  return new Date(today.toDateString());
}

class Moment {
  constructor(moment = Today()) {
    if (!moment.time) moment = convertDateToObject(moment);
    const { year, month, date, day, time } = moment;

    this.year = year;
    this.month = month;
    this.date = date;
    this.day = day;
    this.time = time;
  }

  get weekDay() {
    return WEEK_DAYS[this.day];
  }

  setYear(number) {
    const date = new Date(this.time);
    date.setFullYear(number);
    return new Moment(date);
  }

  addMonth(number) {
    const date = new Date(this.time);
    date.setMonth(date.getMonth() + number);
    return new Moment(date);
  }

  addDate(number) {
    const date = new Date(this.time);
    date.setDate(date.getDate() + number);
    return new Moment(date);
  }

  toObject() {
    return {
      year: this.year,
      month: this.month,
      date: this.date,
      day: this.day,
      weekDay: this.weekDay,
      time: this.time,
    };
  }

  toDate() {
    return new Date(this.time);
  }
}

export default Moment;

export function calculateMonth(year, month) {
  const startDate = new Date(year, month - 1, 1);
  startDate.setDate(1 - startDate.getDay());

  const dates = [];
  for (let i = 0, count = 0; i < 6; i++) {
    const week = [];
    for (let j = 1; j <= 7; j++, count++) {
      week.push(new Moment(startDate).addDate(count).toObject());
    }
    dates.push(week);
  }
  return dates;
}

function convertDateToObject(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    day: date.getDay(),
    time: date.getTime(),
  };
}
