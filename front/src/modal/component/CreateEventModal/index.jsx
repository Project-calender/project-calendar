import React, { useContext, useEffect, useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

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
import Moment from '../../../utils/moment';
import Input from '../../../components/common/Input';
import CheckBox from '../../../components/common/CheckBox';
import Modal from '../../../components/common/Modal';
import { EventBarContext } from '../../../context/EventBarContext';
import {
  CreateEventModalContext,
  EventInfoListModalContext,
} from '../../../context/EventModalContext';

import { useDispatch, useSelector } from 'react-redux';
import { selectAllCalendar } from '../../../store/selectors/calendars';

import EventColorOption from '../../../components/calendar/EventColorOption';
import { EVENT_COLOR } from '../../../styles/color';
import {
  setNewEventBars,
  updateNewEventBarProperty,
} from '../../../store/events';
import { useCallback } from 'react';
import { checkedCalendarSelector } from '../../../store/selectors/user';

const Index = ({ children: ModalList }) => {
  const dispatch = useDispatch();
  const { selectedDateRange } = useContext(EventBarContext);
  const { hideModal: hideCreateEventModal, modalData } = useContext(
    CreateEventModalContext,
  );
  const {
    showModal: showEventInfoListModal,
    hideModal: hideEventInfoListModal,
  } = useContext(EventInfoListModalContext);

  function initCreateEventModal() {
    dispatch(setNewEventBars([]));
    hideCreateEventModal(true);
  }

  function handleEventTitle(e) {
    setEventInfo(info => ({ ...info, eventName: e.target.value }));
    dispatch(
      updateNewEventBarProperty({ key: 'eventName', value: e.target.value }),
    );
  }

  const { standardDateTime, endDateTime } = selectedDateRange;
  const [startDate, endDate] = [standardDateTime, endDateTime]
    .sort((a, b) => a - b)
    .map(time => new Moment(time));

  const calendars = useSelector(selectAllCalendar);
  const checkedCalendar = useSelector(checkedCalendarSelector);
  let baseCalendarIndex = calendars.findIndex(calendar =>
    checkedCalendar.includes(calendar.id),
  );
  if (baseCalendarIndex === -1) baseCalendarIndex = 0;

  const [eventInfo, setEventInfo] = useState({
    calendarId: baseCalendarIndex,
    eventName: '',
    color: calendars[baseCalendarIndex].color,
    memo: '',
    startTime: startDate.time,
    endTime: endDate.time,
    busy: 1,
    permission: 1,
    allDay: true,
  });

  useEffect(() => {
    dispatch(
      updateNewEventBarProperty({
        key: 'calendarColor',
        value: calendars[baseCalendarIndex].color,
      }),
    );
  }, []);

  const eventInfoList = {
    busy: ['바쁨', '한가함'],
    repeat: [
      '반복 안함',
      '매일',
      `매주 ${startDate.weekDay}요일`,
      `매월 마지막 ${startDate.weekDay}요일`,
      `매년 ${startDate.month}월 ${startDate.date}일`,
      '주중 매일(월-금)',
      '맞춤...',
    ],
    permission: ['기본 공개 설정', '전체 공개', '비공개'],
  };

  const changeColor = useCallback(color => {
    setEventInfo(info => ({ ...info, color }));
    dispatch(updateNewEventBarProperty({ key: 'eventColor', value: color }));
  }, []);

  const [EventColorModal, EventInfoListModal] = ModalList;
  function onClickListModalItem(e) {
    const [name, value] = [
      e.target.getAttribute('name'),
      +e.target.getAttribute('value'),
    ];

    if (name === 'calendarId') {
      dispatch(
        updateNewEventBarProperty({
          key: 'calendarColor',
          value: calendars[value].color,
        }),
      );
      dispatch(
        updateNewEventBarProperty({
          key: 'eventColor',
          value: null,
        }),
      );
      setEventInfo(info => ({
        ...info,
        [name]: value,
        color: calendars[value].color,
      }));
    } else {
      setEventInfo(info => ({ ...info, [name]: value }));
    }

    hideEventInfoListModal();
    e.stopPropagation();
  }

  return (
    <Modal
      hideModal={initCreateEventModal}
      isCloseButtom
      isBackground
      style={{
        ...modalData?.style,
        boxShadow: '2px 10px 24px 10px rgb(0, 0, 0, 0.25)',
      }}
    >
      {EventColorModal}
      {EventInfoListModal &&
        React.cloneElement(EventInfoListModal, {
          onClickItem: onClickListModalItem,
        })}
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
              onBlur={handleEventTitle}
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
              <CheckBox
                checked={eventInfo.allDay}
                onChange={e =>
                  setEventInfo(info => ({ ...info, allDay: e.target.checked }))
                }
              >
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
                  showEventInfoListModal(e, eventInfoList['repeat'], 'repeat')
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
                  showEventInfoListModal(
                    e,
                    calendars.map(calendar => calendar.name),
                    'calendarId',
                  )
                }
              >
                {calendars[eventInfo.calendarId].name}
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
              </h3>
              <EventColorOption
                colors={{
                  ...EVENT_COLOR,
                  ...(!Object.values(EVENT_COLOR).includes(
                    calendars[eventInfo.calendarId].color,
                  ) && {
                    '캘린더 색상': calendars[eventInfo.calendarId].color,
                  }),
                }}
                color={eventInfo?.color}
                changedColor={changeColor}
              />
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faBriefcase} />

            <div
              onClick={e =>
                showEventInfoListModal(e, eventInfoList['busy'], 'busy')
              }
            >
              <h3 className={styles.list_modal}>
                {eventInfoList['busy'][eventInfo.busy]}
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
                  showEventInfoListModal(
                    e,
                    eventInfoList['permission'],
                    'permission',
                  )
                }
              >
                {eventInfoList['permission'][eventInfo.permission]}
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
                  ...eventInfo,
                  calendarId: calendars[eventInfo.calendarId].id,
                  startTime: new Date(eventInfo.startTime).toUTCString(),
                  endTime: new Date(eventInfo.endTime).toUTCString(),
                  color:
                    calendars[eventInfo.calendarId].color === eventInfo.color
                      ? null
                      : eventInfo.color,
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
  children: PropTypes.node,
};

export default Index;
