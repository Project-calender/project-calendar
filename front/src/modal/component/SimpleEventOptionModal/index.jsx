import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../components/common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import EventColor from '../../../components/calendar/EventColor';
import { EVENT_COLOR } from '../../../styles/color';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEvent, updateEventColor } from '../../../store/thunk/event';
import { calendarByEventIdSelector } from '../../../store/selectors/calendars';
const Index = ({ hideModal, modalData }) => {
  const { event } = modalData;
  const calendar = useSelector(state =>
    calendarByEventIdSelector(state, event.CalendarId),
  );

  const dispatch = useDispatch();
  function handleDeleteEvent() {
    dispatch(deleteEvent(event));
    hideModal();
  }

  function onClickColor(e, color) {
    dispatch(
      updateEventColor({
        calendarId: event.CalendarId,
        eventId: event.id,
        color: calendar.color === color ? null : color,
      }),
    );
    hideModal();
  }

  return (
    <Modal
      hideModal={hideModal}
      style={{ ...modalData.style, borderRadius: 0, padding: 0 }}
    >
      <div className={styles.modal_container}>
        <ul>
          <li className={styles.delete_event} onClick={handleDeleteEvent}>
            <FontAwesomeIcon icon={faTrashCan} />
            <em>삭제</em>
          </li>
        </ul>
        <hr />
        <div className={styles.event_color}>
          <EventColor
            colors={
              Object.values(EVENT_COLOR).includes(event.color || calendar.color)
                ? EVENT_COLOR
                : { ...EVENT_COLOR, ['캘린더 색상']: calendar.color }
            }
            selectedColor={event.color || calendar.color}
            onClickColor={onClickColor}
          />
        </div>
      </div>
    </Modal>
  );
};
Index.propTypes = {
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
};

export default Index;
