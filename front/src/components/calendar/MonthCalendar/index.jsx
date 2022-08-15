import React, { useEffect } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import WeekDayHeader from './WeekDayHeader';
import CalendarBody from './CalendarBody';
import SimpleEventOptionModal from '../../../modal/component/SimpleEventOptionModal';
import ModalLayout from '../../../modal/layout/ModalLayout';
import { SimpleEventOptionModalContext } from '../../../context/EventModalContext';

import { useDispatch } from 'react-redux';
import useDragDate from '../../../hooks/useDragDate';
import useCreateEventBar from '../../../hooks/useCreateEventBar';
import { updateNewEventBarProperties } from '../../../store/newEvent';
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
      const [startDate, endDate] = [standardDateTime, endDateTime].sort(
        (a, b) => a - b,
      );

      dispatch(
        updateNewEventBarProperties({
          bars: newEventBars,
          startTime: startDate,
          endTime: endDate,
        }),
      );
    }
  }, [dispatch, newEventBars, selectedDateRange]);

  return (
    <ModalLayout
      Modal={SimpleEventOptionModal}
      Context={SimpleEventOptionModalContext}
    >
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
    </ModalLayout>
  );
};

Index.propTypes = {
  month: PropTypes.array,
};

export default Index;
