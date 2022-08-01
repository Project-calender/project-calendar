import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../components/common/Modal';
import EventContainer from './EventContainer';
import { useSelector } from 'react-redux';
import { calendarByEventIdsSelector } from '../../../store/selectors/calendars';

const Index = ({ modalData, hideModal }) => {
  const { date, events, style } = modalData;

  const calendars = useSelector(state =>
    calendarByEventIdsSelector(state, events || []),
  );

  return (
    <Modal hideModal={hideModal} style={style} isCloseButtom={true}>
      <div className={styles.modal_container}>
        <strong>{date.weekDay}</strong>
        <h1>{date.date}</h1>
        {events?.length ? (
          events.map((event, index) => (
            <EventContainer
              key={event.id}
              event={event}
              calendarColor={calendars[index].color}
              date={date}
            />
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
