import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../common/Modal';
import EventBar from '../CalendarBody/Date/EventBar';

export const triggerDOM = 'month-event-list';

const Index = ({ modalData, hideModal }) => {
  const { date, events, position } = modalData;

  return (
    <Modal hideModal={hideModal} triggerDOM={triggerDOM} position={position}>
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
  hideModal: PropTypes.func,
};

export default Index;
