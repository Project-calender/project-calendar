import React, { useEffect } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import useDragDate from '../../../hooks/useDragDate';
import useCreateEventBar from '../../../hooks/useCreateEventBar';
import Moment from '../../../utils/moment';
import { updateNewEventBarProperties } from '../../../store/newEvent';
import WeekDayHeader from './WeekDayHeader';
import CalendarBody from './CalendarBody';
import { useDispatch } from 'react-redux';
import { EventBarContext } from '../../../context/EventBarContext';

const Index = ({ month }) => {
  const dispatch = useDispatch();
  const {
    handleMouseDown,
    handleMouseUp,
    handleDrag,
    isMouseDown,
    selectedDateRange,
  } = useDragDate();
  const dragContextData = { isMouseDown, selectedDateRange };

  const { newEventBars } = useCreateEventBar(selectedDateRange);
  useEffect(() => {
    if (newEventBars.length) {
      const { standardDateTime, endDateTime } = selectedDateRange;
      const [startDate, endDate] = [standardDateTime, endDateTime]
        .sort((a, b) => a - b)
        .map(time => new Moment(time));

      dispatch(
        updateNewEventBarProperties({
          bars: newEventBars,
          startTime: startDate.time,
          endTime: endDate.time,
        }),
      );
    }
  }, [dispatch, newEventBars, selectedDateRange]);

  return (
    <EventBarContext.Provider value={dragContextData}>
      <table
        className={styles.calendar_table}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={isMouseDown ? handleDrag : null}
      >
        <thead>
          <WeekDayHeader />
        </thead>
        <tbody>
          <CalendarBody month={month} />
        </tbody>
      </table>
    </EventBarContext.Provider>
  );
};

Index.propTypes = {
  month: PropTypes.array,
};

export default Index;
