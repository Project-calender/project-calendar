import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ week, selectedDate, setSelectedDate }) => {
  function initDateClassName(date) {
    let className = '';
    if (date.isToday()) className += styles.date_today;
    else if (date.month !== selectedDate.getMonth() + 1)
      className += styles.date_blur;
    else if (date.time === selectedDate.getTime())
      className += styles.date_button_select;

    return className;
  }

  return (
    <tr className={styles.calendar_tr}>
      {week.map(date => (
        <td
          key={date.time}
          className={`${initDateClassName(date)}`}
          onClick={() => {
            setSelectedDate(new Date(date.time));
          }}
        >
          <em>{date.date}</em>
        </td>
      ))}
    </tr>
  );
};

Index.propTypes = {
  week: PropTypes.array,
  selectedDate: PropTypes.object,
  setSelectedDate: PropTypes.func,
};

export default Index;
