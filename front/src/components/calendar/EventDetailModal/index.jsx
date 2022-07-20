import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../common/Modal';
import Moment from '../../../utils/moment';
import { useSelector } from 'react-redux';
import { calendarByEventIdSelector } from '../../../store/selectors/calendars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDay,
  faEllipsisVertical,
  faEnvelope,
  faPen,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

export const triggerDOM = 'month-event-detail';

const Index = ({ modalData, hideModal }) => {
  const { position, event } = modalData;

  const calendar = useSelector(state =>
    calendarByEventIdSelector(state, event),
  );
  console.log(calendar);
  return (
    <Modal hideModal={hideModal} triggerDOM={triggerDOM} position={position}>
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <FontAwesomeIcon icon={faPen} />
          <FontAwesomeIcon icon={faTrashCan} />
          <FontAwesomeIcon icon={faEnvelope} />
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </div>
        <div>
          <div
            className={styles.event_color}
            style={{ background: event.color }}
          />
          <h1>{event.name || '(제목 없음)'}</h1>
          <p>{intiDateTitle(event)}</p>
        </div>

        <div>
          <FontAwesomeIcon icon={faCalendarDay} />
          <div>
            <p>{calendar.name}</p>
            <p>만든 사용자:</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

function intiDateTitle(event) {
  const [startDate, endDate] = [
    new Moment(event.startTime),
    new Moment(event.endTime),
  ];
  const startDateTitle = startDate.toDateString().split(' ');
  const endDateTitle = endDate.toDateString().split(' ');
  if (startDateTitle.join(' ') === endDateTitle.join(' '))
    return `${startDate.month}월 ${startDate.date}일 (${startDate.weekDay}요일)`;

  const index = startDateTitle.findIndex(str => !endDateTitle.includes(str));
  return `${startDateTitle.join(' ')} - ${endDateTitle.slice(index).join(' ')}`;
}

Index.propTypes = {
  modalData: PropTypes.object,
  hideModal: PropTypes.func,
};

export default Index;
