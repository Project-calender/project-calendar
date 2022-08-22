import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import Modal from '../../../components/common/Modal';
import MiniCalendar from '../../../components/SideBar/MiniCalendar';
import { useDispatch, useSelector } from 'react-redux';
import {
  setNewEventBars,
  updateNewEventBarProperties,
} from '../../../store/newEvent';
import { newEventSelector } from '../../../store/selectors/newEvent';
import Moment from '../../../utils/moment';
import { createEventBar } from '../../../hooks/useCreateEventBar';
import { selectDate } from '../../../store/date';
import { selectedDateSelector } from '../../../store/selectors/date';
import { useState } from 'react';

const Index = ({ hideModal, modalData }) => {
  const { selectedDate: dates, style } = modalData;
  const selectedDate = {
    startDate: dates.startDate && new Moment(dates.startDate.time).resetTime(),
    endDate: dates.endDate && new Moment(dates.endDate.time).resetTime(),
  };

  const dispatch = useDispatch();
  const newEvent = useSelector(newEventSelector);
  const monthCalendarDate = useSelector(selectedDateSelector);
  function onClickDate(e, date) {
    const newDate = {
      startTime: newEvent.startTime,
      endTime: newEvent.startTime,
    };

    if (selectedDate.startDate) {
      newDate.startTime = date.time;
      const diffDate = new Moment(newEvent.startTime).calculateDateDiff(
        date.time,
      );
      newDate.endTime = new Moment(newEvent.endTime).addDate(diffDate).time;
    }

    if (selectedDate.endDate) {
      newDate.endTime = date.time;
    }

    const [startTime, endTime] = [newDate.startTime, newDate.endTime]
      .map(time => new Moment(time).resetTime().time)
      .sort((a, b) => a - b);
    const eventBars = createEventBar({
      standardDateTime: startTime,
      endDateTime: endTime,
    });
    dispatch(setNewEventBars(eventBars));
    dispatch(updateNewEventBarProperties({ startTime, endTime }));

    const startDate = new Moment(startTime);
    if (
      `${monthCalendarDate.year} ${monthCalendarDate.month}` !==
      `${startDate.year} ${startDate.month}`
    ) {
      dispatch(selectDate(startDate.toObject()));
    }

    hideModal();
    e.stopPropagation();
  }

  const [miniCalendarDate, setMiniCalendarDate] = useState(
    new Moment(selectedDate?.startDate || selectedDate?.endDate),
  );

  return (
    <Modal hideModal={hideModal} style={{ ...style, borderRadius: 0 }}>
      <div className={styles.modal_container}>
        <MiniCalendar
          selectedDate={selectedDate?.startDate || selectedDate?.endDate}
          onClickDate={onClickDate}
          calendarDate={miniCalendarDate}
          setCalendarDate={setMiniCalendarDate}
        />
      </div>
    </Modal>
  );
};

Index.propTypes = {
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
};

export default Index;