import React, { useContext } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../components/common/Modal';
import { EventBarContext } from '../../../context/EventBarContext';
import {
  EventColorModalContext,
  ListModalContext,
} from '../../../context/EventModalContext';
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
import Input from '../../../components/common/Input';
import CheckBox from '../../../components/common/CheckBox';

import Moment from '../../../utils/moment';
import { EVENT_COLOR } from '../../../styles/color';

import { useSelector } from 'react-redux';
import { selectAllCalendar } from '../../../store/selectors/calendars';

const Index = ({ hideModal, style, children: ModalList }) => {
  const { selectedDateRange, setNewEventBars } = useContext(EventBarContext);
  const { standardDateTime, endDateTime } = selectedDateRange;
  const [startDate, endDate] = [standardDateTime, endDateTime]
    .sort((a, b) => a - b)
    .map(time => new Moment(time));

  const { showModal: showListModal } = useContext(ListModalContext);
  const { showModal: showEventColorModal } = useContext(EventColorModalContext);
  const calendars = useSelector(selectAllCalendar);

  function hideCreateEventModal() {
    setNewEventBars([]);
    hideModal();
  }

  return (
    <Modal
      hideModal={hideCreateEventModal}
      isCloseButtom
      isBackground
      style={{
        ...style,
        boxShadow: '2px 10px 24px 10px rgb(0, 0, 0, 0.25)',
      }}
    >
      {ModalList}

      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <FontAwesomeIcon icon={faGripLines} />
        </div>
        <div className={styles.modal_context}>
          <div className={styles.event_title}>
            <div />
            <Input
              type="text"
              placeholder="제목 및 시간 추가"
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
                {startDate.month}월 {startDate.date}일 ({startDate.weekDay}
                요일)
              </h3>
              <h3>-</h3>
              <h3>
                {endDate.month}월 {endDate.date}일 ({endDate.weekDay}요일)
              </h3>
              {/* <h5>반복 안함</h5> */}
            </div>
            {/* <button className={styles.time_add_button}>시간 추가</button> */}
          </div>

          <div>
            <div />
            <div>
              <CheckBox onClick={() => {}}>
                <h3>종일</h3>
              </CheckBox>
            </div>
          </div>

          <div>
            <div />
            <div>
              <h3
                className={styles.list_modal}
                onClick={e =>
                  showListModal(e, [
                    '반복 안함',
                    '매일',
                    `매주 ${startDate.weekDay}요일`,
                    `매월 마지막 ${startDate.weekDay}요일`,
                    `매년 ${startDate.month}월 ${startDate.date}일`,
                    '주중 매일(월-금)',
                    '맞춤...',
                  ])
                }
              >
                반복 안함
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
              </h3>
            </div>
          </div>

          <div className={styles.time_find}>
            <div />
            <button className={styles.time_find_button}>시간 찾기</button>
          </div>

          <div className={styles.event_info_input}>
            <FontAwesomeIcon icon={faUserGroup} />
            <Input type="text" placeholder="참석자 추가" />
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
          <div className={styles.event_info_input}>
            <FontAwesomeIcon icon={faLocationDot} />
            <Input type="text" placeholder="위치 추가" />
          </div>

          <div className={styles.modal_line} />

          <div className={styles.memo}>
            <FontAwesomeIcon icon={faBarsStaggered} />
            <Input type="text" placeholder="설명 추가" />
          </div>
          <div>
            <FontAwesomeIcon icon={faPaperclip} className={styles.clip_icon} />
            <h4>첨부파일 추가</h4>
          </div>

          <div className={styles.modal_line} />
          <div>
            <FontAwesomeIcon icon={faCalendarDay} />
            <div className={styles.calendar_info}>
              <h3
                className={styles.list_modal}
                onClick={e =>
                  showListModal(
                    e,
                    calendars.map(calendar => calendar.name),
                  )
                }
              >
                내 캘린더
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
              </h3>
              <div
                className={`${styles.list_modal} ${styles.calendar_info}`}
                id="event_color"
                onClick={e => showEventColorModal(e, EVENT_COLOR)}
              >
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

            <div onClick={e => showListModal(e, ['바쁨', '한가함'])}>
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
              <h3
                className={styles.list_modal}
                onClick={e =>
                  showListModal(e, ['기본 공개 설정', '전체 공개', '비공개'])
                }
              >
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
  children: PropTypes.node,
};

export default Index;
