import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import AddEventButton from './AddEventButton';
import UserSearch from './UserSearch';
import MyCalendarList from './MyCalendarList';
import SubscriptionCalendarList from './SubscriptionCalendarList';
import MiniCalendar from './MiniCalendar';
import { useState } from 'react';
import { useEffect } from 'react';

const Index = ({ sideBar }) => {
  let [closeClass, setCloseClass] = useState(``);

  function sideBarClose() {
    if (sideBar == true) {
      setCloseClass(`${styles.close}`);
    } else {
      setCloseClass(``);
    }
  }

  useEffect(() => {
    sideBarClose();
  }, [sideBar]);

  return (
    <aside className={`${styles.sidebar} ${closeClass}`}>
      <div className={styles.sidebar_event_button}>
        <AddEventButton />
      </div>
      <div className={styles.sidebar_calender}>
        <MiniCalendar />
        <UserSearch />
        <MyCalendarList />
        <SubscriptionCalendarList />
      </div>
    </aside>
  );
};
Index.propTypes = {
  sideBar: PropTypes.bool,
};

export default Index;
