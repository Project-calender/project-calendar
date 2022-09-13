import React, { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { EVENT } from '../../../store/events';
import Moment from '../../../utils/moment';
import useEventModal from '../../../hooks/useEventModal';

import Input from '../../../components/common/Input';
import MiniCalendarModal from '../MiniCalendarModal';
import TimeListModal from '../../../modal/component/TimeListModal';
import { useImperativeHandle } from 'react';

const Index = React.forwardRef(({ event, setEvent }, ref) => {
  const [startDate, endDate] = [event.startTime, event.endTime].map(
    time => new Moment(new Date(time)),
  );

  useImperativeHandle(ref, () => ({
    checkEndDate: endDate => checkEndDate(endDate, setEndDateError),
    setEndDateError,
  }));

  const startMiniCalendarModal = useEventModal();
  const endMiniCalendarModal = useEventModal();
  const startTimeListModal = useEventModal();
  const endTimeListModal = useEventModal();

  const [endDateErorr, setEndDateError] = useState('');
  const [endDateTimeErorr, setEndDateTimeError] = useState('');

  function checkEndDate(endDate, setError) {
    if (endDate.time < startDate.time) {
      const message = '일정 종료는 시작 시간 이후여야 합니다.';
      setError(message);
      return false;
    }
    setError('');
    return true;
  }

  function onClickTimeItem(e, type) {
    const date = new Date(+e.target.dataset.value);
    const newDate = new Moment(new Date(event[type]))
      .setHour(date.getHours())
      .setMinute(date.getMinutes());

    setEvent(event => ({
      ...event,
      [type]: new Date(newDate.time).toISOString(),
    }));

    if (type === 'startTime') startTimeListModal.hideModal();
    if (type === 'endTime') endTimeListModal.hideModal();
    e.stopPropagation();
  }

  function onClickStartDate(e, date) {
    const diffDate = startDate.resetTime().calculateDateDiff(date.time);

    const nextStartDate = new Moment(date.time)
      .setHour(startDate.hour)
      .setMinute(startDate.minute);
    const nextEndDate = endDate.addDate(diffDate);

    setEvent(event => ({
      ...event,
      startTime: new Date(nextStartDate.time).toISOString(),
      endTime: new Date(nextEndDate.time).toISOString(),
    }));

    startMiniCalendarModal.hideModal();
    e.stopPropagation();
  }

  function onClickEndDate(e, date) {
    const newDate = new Moment(date.time)
      .setHour(endDate.hour)
      .setMinute(endDate.minute);

    setEvent(event => ({
      ...event,
      endTime: new Date(newDate.time).toISOString(),
    }));

    endMiniCalendarModal.hideModal();
    e.stopPropagation();
  }

  function hideSubModal() {
    startMiniCalendarModal.hideModal();
    endMiniCalendarModal.hideModal();
    startTimeListModal.hideModal();
    endTimeListModal.hideModal();
  }

  function handleStartTimeList(e) {
    hideSubModal();
    const { top, left } = e.currentTarget.getBoundingClientRect();
    startTimeListModal.showModal({
      selectedItem: startDate.toTimeString(),
      style: { top: top + 45, left },
    });
    e.stopPropagation();
  }

  function handleEndTimeList(e) {
    hideSubModal();
    const { top, left } = e.currentTarget.getBoundingClientRect();
    endTimeListModal.showModal({
      selectedItem: endDate.toTimeString(),
      style: { top: top + 45, left },
    });
    e.stopPropagation();
  }

  function handleStartMiniCalendar(e, selectedDate) {
    hideSubModal();
    const { top, left } = e.currentTarget.getBoundingClientRect();
    startMiniCalendarModal.showModal({
      selectedDate,
      style: { top: top + 45, left },
    });
    e.stopPropagation();
  }

  function handleEndMiniCalendar(e, selectedDate) {
    hideSubModal();
    const { top, left } = e.currentTarget.getBoundingClientRect();
    endMiniCalendarModal.showModal({
      selectedDate,
      style: { top: top + 45, left },
    });
    e.stopPropagation();
  }

  return (
    <div className={styles.event_time_container}>
      <Input
        value={startDate.toDateString()}
        className={styles.input_fill}
        onClick={e => handleStartMiniCalendar(e, { startDate })}
      />
      {event.allDay === EVENT.allDay.false && (
        <Input
          value={startDate.toTimeString()}
          className={`${styles.input_fill} ${styles.time_input}`}
          onClick={handleStartTimeList}
        />
      )}
      <em>-</em>
      {event.allDay === EVENT.allDay.false && (
        <div className={styles.input_container}>
          {endDateTimeErorr && (
            <div className={styles.error_message}>
              <p>{endDateTimeErorr}</p>
              <div className={styles.square} />
            </div>
          )}
          <Input
            value={endDate.toTimeString()}
            className={`${styles.input_fill} ${styles.time_input} ${
              endDate.time < startDate.time ? styles.error_input : ''
            }`}
            onClick={handleEndTimeList}
            onFocus={() => checkEndDate(endDate, setEndDateTimeError)}
            onBlur={() => setEndDateTimeError('')}
          />
        </div>
      )}
      <div className={styles.input_container}>
        {endDateErorr && (
          <div className={styles.error_message}>
            <p>{endDateErorr}</p>
            <div className={styles.square} />
          </div>
        )}
        <Input
          value={endDate.toDateString()}
          className={`${styles.input_fill} ${
            endDate.time < startDate.time ? styles.error_input : ''
          }`}
          onClick={e => handleEndMiniCalendar(e, { endDate })}
          onFocus={() => checkEndDate(endDate, setEndDateError)}
          onBlur={() => setEndDateError('')}
        />
      </div>
      {startMiniCalendarModal.isModalShown && (
        <MiniCalendarModal
          hideModal={startMiniCalendarModal.hideModal}
          modalData={startMiniCalendarModal.modalData}
          onClickDate={onClickStartDate}
        />
      )}
      {endMiniCalendarModal.isModalShown && (
        <MiniCalendarModal
          hideModal={endMiniCalendarModal.hideModal}
          modalData={endMiniCalendarModal.modalData}
          onClickDate={onClickEndDate}
        />
      )}
      {startTimeListModal.isModalShown && (
        <TimeListModal
          hideModal={startTimeListModal.hideModal}
          modalData={startTimeListModal.modalData}
          onClickItem={e => onClickTimeItem(e, 'startTime')}
        />
      )}
      {endTimeListModal.isModalShown && (
        <TimeListModal
          hideModal={endTimeListModal.hideModal}
          modalData={endTimeListModal.modalData}
          onClickItem={e => onClickTimeItem(e, 'endTime')}
        />
      )}
    </div>
  );
});

Index.propTypes = {
  event: PropTypes.object,
  setEvent: PropTypes.func,
};

Index.displayName = 'EventDateTitle';

export default Index;
