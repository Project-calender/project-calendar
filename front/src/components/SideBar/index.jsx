import React from 'react';
import styles from './style.module.css';
import AddEventButton from './AddEventButton';
import UserSearch from './UserSearch';
import MyCalendarList from './calendars/MyCalendarList';
import SubscriptionCalendarList from './calendars/SubscriptionCalendarList';

const Index = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar_event_button}>
        <AddEventButton />
      </div>
      <div className={styles.sidebar_calender}>
        <UserSearch />
        <MyCalendarList />
        <SubscriptionCalendarList />
      </div>
    </aside>
  );
};

export default Index;
