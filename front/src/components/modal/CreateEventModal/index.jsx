import React, { useContext } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../common/Modal';
import { EventBarContext } from '../../../context/EventBarContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsStaggered,
  faBell,
  faBriefcase,
  faCalendarDay,
  faCaretDown,
  faCircleQuestion,
  faClock,
  faGripLines,
  faLocationDot,
  faLock,
  faPaperclip,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

import axios from '../../../utils/token';
import Input from '../../common/Input';
import Moment from '../../../utils/moment';

const Index = ({ hideModal, style }) => {
  const { selectedDateRange, setNewEventBars } = useContext(EventBarContext);
  const { standardDateTime, endDateTime } = selectedDateRange;
  const [startDate, endDate] = [standardDateTime, endDateTime]
    .sort((a, b) => a - b)
    .map(time => new Moment(time));

  function handleModal() {
    setNewEventBars([]);
    hideModal();
  }

  return (
    <Modal
      hideModal={handleModal}
      isCloseButtom={true}
      isBackground={true}
      style={{ ...style, boxShadow: '2px 10px 24px 10px rgb(0, 0, 0, 0.25)' }}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <FontAwesomeIcon icon={faGripLines} />
        </div>
        <div className={styles.modal_context}>
          <div>
            <div />
            <Input
              type="text"
              placeholder="제목 및 시간 추가"
              className={styles.event_title}
              inputClassName={styles.event_title_input}
              onBlur={e => {
                setNewEventBars(bars =>
                  bars.map(bar => ({ ...bar, name: e.target.value })),
                );
              }}
            />
          </div>

          <div>
            <div />
            <div className={styles.modal_context_category}>
              <button className={styles.category_active}>이벤트</button>
              <button>할 일</button>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faClock} />
            <div className={styles.time_title}>
              <h3>
                {startDate.month}월 {startDate.date}일 ({startDate.weekDay}요일)
              </h3>
              <h3>-</h3>
              <h3>
                {endDate.month}월 {endDate.date}일 ({endDate.weekDay}요일)
              </h3>
              <h5>반복 안함</h5>
            </div>
            <button className={styles.time_add_button}>시간 추가</button>
          </div>

          <div className={styles.time_find}>
            <div />
            <button className={styles.time_find_button}>시간 찾기</button>
          </div>

          <div>
            <FontAwesomeIcon icon={faUserGroup} />
            <Input
              type="text"
              placeholder="참석자 추가"
              className={styles.event_data}
              inputClassName={styles.event_data_input}
            />
          </div>

          <div className={styles.google_meet}>
            <img
              className={styles.google_meet_img}
              src={`${process.env.PUBLIC_URL}/img/google_meet_icon.png`}
              alt="구글 미팅"
            />
            <button>
              <b>Google Meet</b> 화상 회의 추가
            </button>
          </div>

          <div className={styles.modal_line} />
          <div>
            <FontAwesomeIcon icon={faLocationDot} />
            <Input
              type="text"
              placeholder="위치 추가"
              className={styles.event_data}
              inputClassName={styles.event_data_input}
            />
          </div>

          <div className={styles.modal_line} />
          <div>
            <FontAwesomeIcon icon={faBarsStaggered} />
            <Input
              type="text"
              placeholder="설명 추가"
              className={styles.memo}
              inputClassName={styles.memo_input}
            />
          </div>
          <div>
            <FontAwesomeIcon icon={faPaperclip} className={styles.clip_icon} />
            <h4>첨부파일 추가</h4>
          </div>

          <div className={styles.modal_line} />
          <div>
            <FontAwesomeIcon icon={faCalendarDay} />
            <div className={styles.calendar_info}>
              <h3 className={styles.list_modal}>
                내 캘린더
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
              </h3>
              <div className={`${styles.list_modal} ${styles.calendar_info}`}>
                <div className={styles.calendar_info_colors} />
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
              </div>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faBriefcase} />
            <div>
              <h3 className={styles.list_modal}>
                한가함
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
              </h3>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faLock} />
            <div className={styles.calendar_info}>
              <h3 className={styles.list_modal}>
                기본 공개 설정
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
              </h3>
              <FontAwesomeIcon icon={faCircleQuestion} />
            </div>
          </div>
          <div>
            <FontAwesomeIcon icon={faBell} />
            <div>
              <h4 className={styles.list_modal}>알림 추가</h4>
            </div>
          </div>
        </div>
        <div className={styles.modal_line} />
        <div className={styles.modal_footer}>
          <button>옵션 더보기</button>
          <button
            onClick={() => {
              axios
                .post('event/createGroupEvent', {
                  groupCalendarId: 1,
                  eventName: '이벤트2',
                  color: '#ff602b',
                  priority: 1,
                  memo: '메모입니다.',
                  startTime: '2022-08-01T00:00:00',
                  endTime: '2022-08-02T00:00:00',
                  allDay: true,
                })
                .then(res => console.log(res))
                .catch(e => console.log(e));
            }}
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
};

Index.propTypes = {
  hideModal: PropTypes.func,
  style: PropTypes.object,
};

export default Index;
