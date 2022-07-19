import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../common/Modal';
import EventBar from '../CalendarBody/Date/EventBar';
const Index = ({ modalData }) => {
  const { date, events } = modalData;
  console.log(events);
  return (
    <Modal>
      <div className={styles.modal_container}>
        <strong>{date.weekDay}</strong>
        <h1>{date.date}</h1>
        {events.map(info => (
          <EventBar key={info.event.id} eventBar={info} />
        ))}
      </div>
    </Modal>
  );
};

Index.propTypes = {
  modalData: PropTypes.object,
};

export default Index;
