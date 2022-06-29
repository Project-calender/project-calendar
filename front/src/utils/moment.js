export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

class Moment {
  constructor(current = new Date()) {
    const { year, month, date, day } = convertDateToObject(current);
    this.year = year;
    this.month = month;
    this.date = date;
    this.day = day;
  }

  get weekDay() {
    return WEEK_DAYS[this.day];
  }
}

function convertDateToObject(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    day: date.getDay(),
  };
}

export function getMonth(date) {
  const dates = [];
  date.setDate(1);
  date.setDate(1 - date.getDay());

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
