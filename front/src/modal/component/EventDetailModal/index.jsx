import React, { useRef, useState } from 'react';
import styles from './style.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsStaggered,
  faBell,
  faBriefcase,
  faCalendarDay,
  faEllipsisVertical,
  faEnvelope,
  faLocationDot,
  faPen,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

import Modal from '../../../components/common/Modal';
import Tooltip from '../../../components/common/Tooltip';
import Moment from '../../../utils/moment';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { calendarByEventIdSelector } from '../../../store/selectors/calendars';
import { useEffect } from 'react';
import EventMemberList from './EventMemberList';
import EventAttendanceButtons from './EventAttendanceButtons';
import { deleteEvent } from '../../../store/thunk/event';
import { EVENT } from '../../../store/events';
import { useNavigate } from 'react-router-dom';
import { EVENT_PATH } from '../../../constants/path';

const Index = ({ modalData, hideModal, onDeleteEvent = null }) => {
  const dispatch = useDispatch();
  if (!onDeleteEvent) {
    onDeleteEvent = () => {
      dispatch(deleteEvent(event));
    };
  }
  const { style, event } = modalData || {};
  const $modal = useRef();
  const [position, setPosition] = useState();
  const calendar = useSelector(state =>
    calendarByEventIdSelector(state, event?.CalendarId),
  );

  const groupCalendar = useSelector(state =>
    calendarByEventIdSelector(state, event?.originCalendarId),
  );

  useEffect(() => {
    let { top = 0, left = 0 } = style || {};
    if (top + $modal.current?.offsetHeight + 15 > window.innerHeight) {
      top = window.innerHeight - $modal.current?.offsetHeight - 35;
    }

    if (left + $modal.current?.offsetWidth > window.innerWidth) {
      left = window.innerWidth - $modal.current?.offsetWidth - 60;
    }

    if (window.innerWidth <= 660) left = 10;
    setPosition({ top, left });
  }, [style]);

  const navigate = useNavigate();
  function showEditEventPage() {
    navigate(EVENT_PATH.EDIT_EVENT, {
      state: {
        id: event.id,
        CalendarId: event.CalendarId,
      },
    });
  }

  if (!event) return;

  return (
    <Modal
      hideModal={hideModal}
      style={{
        ...style,
        ...position,
        boxShadow: '7px 15px 25px 8px rgb(0, 0, 0, 0.3)',
        zIndex: 501,
      }}
      isCloseButtom
    >
      <div className={styles.modal_container} ref={$modal}>
        <div className={styles.modal_header}>
          {calendar.authority >= 2 && (
            <>
              <Tooltip title="일정 수정">
                <FontAwesomeIcon icon={faPen} onClick={showEditEventPage} />
              </Tooltip>
              <Tooltip title="일정 삭제">
                <FontAwesomeIcon
                  icon={faTrashCan}
                  onClick={() => {
                    onDeleteEvent(event);
                    hideModal();
                  }}
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="일부 세부정보 이메일로 전송">
            <FontAwesomeIcon icon={faEnvelope} />
          </Tooltip>
          <Tooltip title="옵션">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </Tooltip>
        </div>

        <div className={styles.modal_body}>
          <div>
            <div
              className={styles.event_color}
              style={{ background: event.color || calendar.color }}
            />
            <div>
              <h1>{event.name || '(제목 없음)'}</h1>
              <h3>
                {event.allDay ? initDateTitle(event) : initTimeDateTitle(event)}
              </h3>
              {event.repeat && <p>매년</p>}
            </div>
          </div>
          {event.location && (
            <div>
              <FontAwesomeIcon icon={faLocationDot} />
              <div>
                <h3>대한민국</h3>
                <p>대한민국</p>
              </div>
            </div>
          )}
          {event.EventMembers && (
            <EventMemberList
              isPrivateCalendar={!groupCalendar && calendar.private}
              eventHost={event.Host}
              eventMembers={event.EventMembers}
            />
          )}
          {event.memo && (
            <div>
              <FontAwesomeIcon icon={faBarsStaggered} />
              <div>
                <h3>{event.memo}</h3>
              </div>
            </div>
          )}
          {event.alerts.length > 0 && (
            <div>
              <FontAwesomeIcon icon={faBell} />
              <div>
                {event.alerts.map((alert, index) => (
                  <h3 key={index}>
                    {event.allDay === EVENT.allDay.true &&
                      EVENT.alerts.getAllDayTitle(alert)}
                    {event.allDay === EVENT.allDay.false &&
                      EVENT.alerts.getNotAllDayTitle(alert)}
                  </h3>
                ))}
              </div>
            </div>
          )}
          <div>
            <FontAwesomeIcon icon={faCalendarDay} />
            <div>
              <h3>
                {calendar.private && Number.isInteger(event.state)
                  ? event.eventHostEmail
                  : groupCalendar?.name || calendar.name}
              </h3>
              {!calendar.private && <p>만든 사용자: {event.eventHostEmail}</p>}
            </div>
          </div>
          <div>
            <FontAwesomeIcon icon={faBriefcase} />
            <div>
              <h3>{EVENT.busy[event.busy]}</h3>
            </div>
          </div>
        </div>

        {Number.isInteger(event.state) && (
          <div className={styles.modal_footer}>
            <div className={styles.modal_line} />
            <EventAttendanceButtons event={event} hideModal={hideModal} />
          </div>
        )}
      </div>
    </Modal>
  );
};

function initDateTitle(event) {
  const [startDate, endDate] = [
    new Moment(new Date(event.startTime)),
    new Moment(new Date(event.endTime)),
  ];

  if (startDate.toDateString() === endDate.toDateString())
    return startDate.toNormalDateString();

  const startDateTitle = startDate.toDateString().split(' ');
  const endDateTitle = endDate.toDateString().split(' ');
  const index = startDateTitle.findIndex(str => !endDateTitle.includes(str));
  return `${startDateTitle.join(' ')} - ${endDateTitle.slice(index).join(' ')}`;
}

function initTimeDateTitle(event) {
  const [startDate, endDate] = [
    new Moment(new Date(event.startTime)),
    new Moment(new Date(event.endTime)),
  ];

  if (startDate.toSimpleDateString() !== endDate.toSimpleDateString())
    return `${startDate.toDateString()}, ${startDate.toTimeString()} ~ ${endDate.toDateString()}, ${endDate.toTimeString()}`;
  if (startDate.getTimeType() === endDate.getTimeType())
    return `${startDate.toNormalDateString()} ⋅ ${startDate.getTimeType()} ${startDate.getSimpleTime()} ~ ${endDate.getSimpleTime()}`;
  return `${startDate.toNormalDateString()} ⋅ ${startDate.toTimeString()} ~ ${endDate.toTimeString()}`;
}

Index.propTypes = {
  modalData: PropTypes.object,
  hideModal: PropTypes.func,
  onDeleteEvent: PropTypes.func,
};
export default Index;
