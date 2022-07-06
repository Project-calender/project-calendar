import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMonth } from '../../store/selectors/date';
import styles from './style.module.css';

import WeekDayHeader from '../../components/calendar/month/WeekDayHeader';
import CalendarBody from '../../components/calendar/month/CalendarBody';
import { addMonth } from '../../store/date';
import { debounce } from '../../utils/delay';
import { EventBarContext } from '../../context/EventBarContext';
import Moment from '../../utils/moment';

const Index = () => {
  const [isMouseMoveEventOn, toggleMouseMoveEvent] = useState(false);
  const [selectedDates, selectDates] = useState({ standard: 0, next: 0 });
  const [eventbars, setEventBars] = useState([]);

  function handleMouse(e) {
    const eventId = +e.target.dataset.eventId;
    if (!eventId) return;

    debounce(() => {
      selectDates(dates => ({ ...dates, next: eventId }));
    }, 200);
  }

  function createEventBar(e) {
    const eventId = +e.target.dataset.eventId;
    if (!eventId) return;
    selectDates({ standard: eventId, next: eventId });
    toggleMouseMoveEvent(true);
  }

  function removeEventBar() {
    toggleMouseMoveEvent(false);
  }

  useLayoutEffect(() => {
    let [minTime, maxTime] = Object.values(selectedDates).sort((a, b) => a - b);

    const events = [];
    let start = new Moment(new Date(minTime));
    while (start.time <= maxTime) {
      const end = start.addDate(6 - start.day);
      if (end.time >= maxTime) {
        events.push({
          time: start.time,
          scale: new Moment(new Date(maxTime)).day - start.day + 1,
        });
        break;
      }

      events.push({ time: start.time, scale: 6 - start.day + 1 });
      start = end.addDate(1);
    }

    setEventBars(events);
  }, [selectedDates]);

  const dispatch = useDispatch();
  function changeMonth(e) {
    if (e.deltaY > 0) dispatch(addMonth(1));
    else dispatch(addMonth(-1));
  }

  const month = useSelector(selectMonth);
  return (
    <div className={`test ${styles.calendar}`} onWheel={changeMonth}>
      <table
        className={styles.calendar_table}
        onMouseDown={createEventBar}
        onMouseUp={removeEventBar}
        onMouseMove={isMouseMoveEventOn ? handleMouse : undefined}
      >
        <thead>
          <WeekDayHeader />
        </thead>
        <tbody>
          <EventBarContext.Provider value={eventbars}>
            <CalendarBody month={month} />
          </EventBarContext.Provider>
        </tbody>
      </table>
    </div>
  );
};

export default Index;
