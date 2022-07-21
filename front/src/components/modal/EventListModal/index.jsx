import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../common/Modal';
import EventContainer from './EventContainer';

export const triggerDOM = 'month-event-list';

const Index = ({ modalData, hideModal }) => {
  const { date, events, style } = modalData;

  return (
    <Modal
      hideModal={hideModal}
      triggerDOM={triggerDOM}
      style={style}
      isCloseButtom={true}
    >
      <div className={styles.modal_container}>
        <strong>{date.weekDay}</strong>
        <h1>{date.date}</h1>
        {events?.length ? (
          events.map(event => (
            <EventContainer key={event.id} event={event} date={date} />
          ))
        ) : (
          <p>이 날짜에는 예정된 일정이 없습니다.</p>
        )}
      </div>
    </Modal>
  );
};

Index.propTypes = {
  modalData: PropTypes.object,
  hideModal: PropTypes.func,
};

export default Index;
