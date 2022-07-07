import React from 'react';

import { useSelector } from 'react-redux';
import styles from './style.module.css';
import CalendarBody from '../../components/calendar/day/CalendarBody';
import DayHeader from '../../components/calendar/day/DayHeader';

const Index = () => {
  //오늘 날짜 가지고 오기
  let state = useSelector(state => {
    return state.date.selectedDate;
  });

  return (
    <article className={styles.today_article}>
      <DayHeader state={state}></DayHeader>
      <CalendarBody state={state}></CalendarBody>
    </article>
  );
};

export default Index;
