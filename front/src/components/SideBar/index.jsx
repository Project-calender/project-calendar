import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import AddEventButton from './AddEventButton';
import UserSearch from './UserSearch';
import MyCalendarList from './MyCalendarList';
import OtherCalendarList from './OtherCalendarList';
import MiniCalendar from './MiniCalendar';

import ModalLayout from '../../modal/layout/ModalLayout';
import {
  DeleteCalendarContext,
  CalendarOptionContext,
} from '../../context/EventModalContext';
import CalendarOptionModal from '../../modal/component/CalendarOptionModal';
import DeleteCalendarModal from '../../modal/component/DeleteCalendarModal';

const Index = ({ isSideBarOn }) => {
  return (
    <ModalLayout Modal={DeleteCalendarModal} Context={DeleteCalendarContext}>
      <ModalLayout Modal={CalendarOptionModal} Context={CalendarOptionContext}>
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
            <OtherCalendarList />
          </div>
        </aside>
      </ModalLayout>
    </ModalLayout>
  );
};

Index.propTypes = {
  isSideBarOn: PropTypes.bool,
};

export default Index;
