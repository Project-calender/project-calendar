import React, { useContext, useEffect, useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Date from './Date';
import { useDispatch, useSelector } from 'react-redux';
import useDragDate from '../../../../hooks/useDragDate';
import useCreateEventBar from '../../../../hooks/useCreateEventBar';
import {
  setNewEventBars,
  updateNewEventBarProperties,
} from '../../../../store/newEvent';
import { CreateEventModalContext } from '../../../../context/EventModalContext';
import { EventBarContext } from '../../../../context/EventBarContext';
import Tooltip from '../../../common/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

const Index = ({ dates, events }) => {
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

  const { showModal: showCreateEventModal } = useContext(
    CreateEventModalContext,
  );

  const isCreateEvent = useSelector(state => state.newEvent.isCreateEvent);
  useEffect(() => {
    if (!isCreateEvent) return;

    // 위치 조정 필요 (임시)
    const dom = document.getElementsByName('new_event')[0];
    const { top, left, width } = dom.getBoundingClientRect();
    const position = { top, left: left - 470 };
    if (position.left < 0) {
      position.left = left;
      position.top = position.top + 30;
    }
    if (position.top + 550 > window.innerHeight) {
      position.top = window.innerHeight - 630;
      position.left = left + width;
      if (position.left + 470 > window.innerWidth) {
        position.left = left - 470;
      }
    }

    showCreateEventModal({
      style: { ...position },
    });
  }, [dispatch, isCreateEvent]);

  function onMouseUp(e) {
    if (!isMouseDown) return;
    handleMouseUp(e);
    dispatch(updateNewEventBarProperties({ isCreateEvent: true }));
    dispatch(setNewEventBars(newEventBars));
  }

  function onMouseDown(e) {
    if (e.target.getAttribute('name') !== 'event-drag-space') return;
    handleMouseDown(e);
  }

  const [readMore, setReadMore] = useState(false);
  return (
    <EventBarContext.Provider value={dragContextData}>
      <div
        className={styles.events_container}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={isMouseDown ? handleDrag : null}
      >
        <div className={styles.calendar_axis_text}>
          <em>GMT+09</em>
          {!readMore && (
            <Tooltip title="종일 섹션 펼치기">
              <button onClick={() => {}} className={styles.angle_icon}>
                <FontAwesomeIcon icon={faAngleUp} />
              </button>
            </Tooltip>
          )}
        </div>
        <div className={styles.calendar_dates}>
          <div className={styles.calendar_axis_line} />
          {dates.map(date => (
            <div key={date.time}>
              <Date date={date} events={events} setReadMore={setReadMore} />
            </div>
          ))}
        </div>
      </div>
    </EventBarContext.Provider>
  );
};

Index.propTypes = {
  dates: PropTypes.array,
  events: PropTypes.array,
};

export default Index;
