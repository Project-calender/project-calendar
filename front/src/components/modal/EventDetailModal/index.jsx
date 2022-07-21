import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsStaggered,
  faBriefcase,
  faCalendarDay,
  faEllipsisVertical,
  faEnvelope,
  faLocationDot,
  faPen,
  faTrashCan,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

import Modal from '../../common/Modal';
import Tooltip from '../../common/Tooltip';
import Moment from '../../../utils/moment';

import { useSelector } from 'react-redux';
import { calendarByEventIdSelector } from '../../../store/selectors/calendars';

export const triggerDOM = 'month-event-detail';

const Index = ({ modalData, hideModal }) => {
  const { style, event } = modalData;

  const calendar = useSelector(state =>
    calendarByEventIdSelector(state, event),
  );

  return (
    <Modal
      hideModal={hideModal}
      triggerDOM={triggerDOM}
      style={{ ...style, boxShadow: '7px 7px 28px 12px rgb(0, 0, 0, 0.3)' }}
      isCloseButtom={true}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <Tooltip title="일정 수정">
            <FontAwesomeIcon icon={faPen} />
          </Tooltip>
          <Tooltip title="일정 삭제">
            <FontAwesomeIcon icon={faTrashCan} />
          </Tooltip>
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
              style={{ background: event.color }}
            />
            <div>
              <h1>{event.name || '(제목 없음)'}</h1>
              <h3>{intiDateTitle(event)}</h3>
              <p>매년</p>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faLocationDot} />
            <div>
              <h3>장소</h3>
              <p>상세 주소</p>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faUserGroup} />
            <div>
              <h3>참석자 1명</h3>
              <p>초대 수락 1명</p>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faBarsStaggered} />
            <div>
              <h3>메모입니다.</h3>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faCalendarDay} />
            <div>
              <h3>{calendar.name}</h3>
              <p>만든 사용자:</p>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faBriefcase} />
            <div>
              <h3>한가함</h3>
            </div>
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
