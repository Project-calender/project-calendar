import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import AddEventButton from './AddEventButton';
import UserSearch from './UserSearch';
import MyCalendarList from './MyCalendarList';
import SubscriptionCalendarList from './SubscriptionCalendarList';
import MiniCalendar from './MiniCalendar';

const Index = ({ isSideBarOn }) => {
  return (
    <aside
      className={`${styles.sidebar} ${!isSideBarOn ? styles.close : null}`}
    >
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
  isSideBarOn: PropTypes.bool,
};

export default Index;
