import React, { useRef, useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsStaggered,
  faBell,
  faBriefcase,
  faCalendarDay,
  faCheck,
  faEllipsisVertical,
  faEnvelope,
  faLocationDot,
  faPen,
  faTrashCan,
  faUserGroup,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import Modal from '../../../components/common/Modal';
import Tooltip from '../../../components/common/Tooltip';
import Moment from '../../../utils/moment';

import { useSelector } from 'react-redux';
import { calendarByEventIdSelector } from '../../../store/selectors/calendars';
import { useEffect } from 'react';

export const triggerDOM = 'month-event-detail';

const Index = ({ modalData, hideModal }) => {
  const $modal = useRef();
  const { style, event } = modalData;
  const [position, setPosition] = useState();
  useEffect(() => {
    let { top, left } = style?.position || {};
    if (top && top + $modal.current?.offsetHeight + 15 > window.innerHeight) {
      top = window.innerHeight - $modal.current?.offsetHeight - 35;
    }

    if (left && left + $modal.current?.offsetWidth > window.innerWidth) {
      left = window.innerWidth - $modal.current?.offsetWidth - 60;
    }

    if (left && window.innerWidth <= 660) left = 10;
    setPosition({ top, left });
  }, [style]);

  const calendar = useSelector(state =>
    calendarByEventIdSelector(state, event),
  );

  return (
    <Modal
      hideModal={hideModal}
      triggerDOM={triggerDOM}
      style={{
        ...style,
        ...position,
        boxShadow: '7px 7px 28px 12px rgb(0, 0, 0, 0.3)',
        zIndex: 501,
      }}
      isCloseButtom={true}
    >
      <div className={styles.modal_container} ref={$modal}>
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
              <h3>대한민국</h3>
              <p>대한민국</p>
            </div>
          </div>
          <div>
            <FontAwesomeIcon icon={faUserGroup} />
            <div>
              <h3>참석자 2명</h3>
              <p>초대 수락 1명, 초대 거부 1명</p>
            </div>
          </div>

          <div>
            <div />
            <div>
              <div className={styles.user_info}>
                <em className={styles.user_profile}>
                  K
                  <FontAwesomeIcon
                    className={`${styles.user_state} ${styles.accept}`}
                    icon={faCheck}
                  />
                </em>

                <h3>사용자</h3>
              </div>
              <div className={styles.user_info}>
                <em className={styles.user_profile}>
                  J
                  <FontAwesomeIcon
                    className={`${styles.user_state} ${styles.reject}`}
                    icon={faXmark}
                  />
                </em>

                <h3>사용자2</h3>
              </div>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faBarsStaggered} />
            <div>
              <h3>{event.memo}</h3>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faBell} />
            <div>
              <h3>30분 전</h3>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faCalendarDay} />
            <div>
              <h3>{calendar.name}</h3>
              <p>만든 사용자: 사용자</p>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faBriefcase} />
            <div>
              <h3>한가함</h3>
            </div>
          </div>
        </div>
        <div className={styles.modal_footer}>
          <div className={styles.modal_line} />
          <div>
            <em>참석 여부</em>
            <div>
              <button>예</button>
              <button className={styles.button_active}>아니요</button>
              <button>미정</button>
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
