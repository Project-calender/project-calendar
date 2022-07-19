import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../common/Modal';
import EventBar from '../CalendarBody/Date/EventBar';
import Moment from '../../../../utils/moment';

export const triggerDOM = 'month-event-list';

const Index = ({ modalData, hideModal }) => {
  const { date, events, position } = modalData;
  return (
    <Modal hideModal={hideModal} triggerDOM={triggerDOM} position={position}>
      <div className={styles.modal_container}>
        <strong>{date.weekDay}</strong>
        <h1>{date.date}</h1>
        {events.map(eventInfo => (
          <EventBar
            key={eventInfo.event.id}
            eventBar={eventInfo}
            left={
              new Moment(new Date(eventInfo.event.startTime)).resetTime()
                .time === date.time
            }
            right={
              new Moment(new Date(eventInfo.event.endTime)).resetTime().time ===
              date.time
            }
            outerRight={true}
          />
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
