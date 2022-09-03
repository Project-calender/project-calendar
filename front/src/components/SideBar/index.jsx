import React, { useEffect } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import AddEventButton from './AddEventButton';
import UserSearch from './UserSearch';
import MyCalendarList from './MyCalendarList';
import OtherCalendarList from './OtherCalendarList';
import MiniCalendar from './MiniCalendar';

import ModalLayout from '../../modal/layout/ModalLayout';
import {
  ResignCalendarContext,
  CalendarOptionContext,
} from '../../context/EventModalContext';
import CalendarOptionModal from '../../modal/component/CalendarOptionModal';
import ResignCalendarModal from '../../modal/component/ResignCalendarModal';
import { useDispatch, useSelector } from 'react-redux';
import { selectedDateSelector } from '../../store/selectors/date';
import { addMonth, selectDate } from '../../store/date';
import { useState } from 'react';
import Moment from '../../utils/moment';
import { getAllCalendar } from '../../store/thunk/calendar';

const Index = ({ isSideBarOn }) => {
  const selectedDate = useSelector(selectedDateSelector);
  const [miniCalendarDate, setMiniCalendarDate] = useState(
    new Moment(selectedDate.time),
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCalendar());
  }, [dispatch]);

  useEffect(() => {
    setMiniCalendarDate(new Moment(selectedDate.time));
  }, [selectedDate]);

  function onClickDate(e, date) {
    dispatch(selectDate(date));
  }

  return (
    <ModalLayout Modal={ResignCalendarModal} Context={ResignCalendarContext}>
      <ModalLayout Modal={CalendarOptionModal} Context={CalendarOptionContext}>
        <aside
          className={`${styles.sidebar} ${!isSideBarOn ? styles.close : null}`}
        >
          <div className={styles.sidebar_event_button}>
            <AddEventButton />
          </div>
          <div className={styles.sidebar_calender}>
            <MiniCalendar
              selectedDate={selectedDate}
              calendarDate={miniCalendarDate}
              setCalendarDate={setMiniCalendarDate}
              onClickDate={onClickDate}
              onClickPreviousMonth={() => dispatch(addMonth(-1))}
              onClickNextMonth={() => dispatch(addMonth(1))}
            />
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
