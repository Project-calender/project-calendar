import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import Modal from '../../../components/common/Modal';
import MiniCalendar from '../../../components/SideBar/MiniCalendar';
import { useDispatch, useSelector } from 'react-redux';
import { selectDate } from '../../../store/date';
import {
  setNewEventBars,
  updateNewEventBarProperties,
} from '../../../store/newEvent';
import { newEventSelector } from '../../../store/selectors/newEvent';
import Moment from '../../../utils/moment';
import { createEventBar } from '../../../hooks/useCreateEventBar';

const Index = ({ hideModal, modalData }) => {
  const { selectedDate, style } = modalData;

  const dispatch = useDispatch();
  const newEvent = useSelector(newEventSelector);
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
      dispatch(selectDate(date));
    }

    if (selectedDate.endDate) {
      newDate.endTime = date.time;
    }

    const eventBars = createEventBar({
      standardDateTime: newDate.startTime,
      endDateTime: newDate.endTime,
    });
    dispatch(setNewEventBars(eventBars));
    dispatch(updateNewEventBarProperties(newDate));
    hideModal();
    e.stopPropagation();
  }
  return (
    <Modal hideModal={hideModal} style={{ ...style, borderRadius: 0 }}>
      <div className={styles.modal_container}>
        <MiniCalendar
          selectedDate={selectedDate?.startDate || selectedDate?.endDate}
          onClickDate={onClickDate}
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
