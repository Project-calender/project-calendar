import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import Modal from '../../../components/common/Modal';
import MiniCalendar from '../../../components/SideBar/MiniCalendar';

import Moment from '../../../utils/moment';
import { useState } from 'react';

const Index = ({ hideModal, modalData, onClickDate }) => {
  const { selectedDate: dates, style } = modalData;
  const selectedDate = {
    startDate: dates.startDate && new Moment(dates.startDate.time).resetTime(),
    endDate: dates.endDate && new Moment(dates.endDate.time).resetTime(),
  };

  const [miniCalendarDate, setMiniCalendarDate] = useState(
    new Moment(selectedDate?.startDate || selectedDate?.endDate),
  );

  return (
    <Modal
      hideModal={hideModal}
      style={{ ...style, borderRadius: 0, width: 280 }}
    >
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
  onClickDate: PropTypes.func,
};

export default Index;
