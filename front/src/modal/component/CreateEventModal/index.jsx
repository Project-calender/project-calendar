import React, { useContext, useEffect } from 'react';
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

import Moment from '../../../utils/moment';
import Input from '../../../components/common/Input';
import CheckBox from '../../../components/common/CheckBox';
import Modal from '../../../components/common/Modal';
import {
  CreateEventModalContext,
  EventInfoListModalContext,
} from '../../../context/EventModalContext';

import { useDispatch, useSelector } from 'react-redux';
import { selectAllCalendar } from '../../../store/selectors/calendars';

import EventColorOption from '../../../components/calendar/EventColorOption';
import { EVENT_COLOR } from '../../../styles/color';
import {
  calculateCurrentTimeRange,
  resetNewEventState,
  updateNewEventBarProperties,
} from '../../../store/newEvent';
import { useCallback } from 'react';
import { checkedCalendarSelector } from '../../../store/selectors/user';
import { createEvent } from '../../../store/thunk/event';
import { newEventSelector } from '../../../store/selectors/newEvent';
import { EVENT } from '../../../store/events';

const Index = ({ children: ModalList }) => {
  const dispatch = useDispatch();
  const { hideModal: hideCreateEventModal, modalData: createEventModalData } =
    useContext(CreateEventModalContext);
  const {
    showModal: showEventInfoListModal,
    hideModal: hideEventInfoListModal,
  } = useContext(EventInfoListModalContext);
  const newEvent = useSelector(newEventSelector);

  const [startDate, endDate] = [newEvent.startTime, newEvent.endTime].map(
    time => new Moment(time),
  );

  const calendars = useSelector(selectAllCalendar);
  const checkedCalendar = useSelector(checkedCalendarSelector);
  let baseCalendarIndex = calendars.findIndex(calendar =>
    checkedCalendar.includes(calendar.id),
  );
  if (baseCalendarIndex === -1) baseCalendarIndex = 0;
  useEffect(() => {
    dispatch(
      updateNewEventBarProperties({
        calendarId: baseCalendarIndex,
        calendarColor: calendars[baseCalendarIndex].color,
      }),
    );
  }, [dispatch, calendars, baseCalendarIndex]);

  const changeColor = useCallback(
    color => {
      dispatch(updateNewEventBarProperties({ eventColor: color }));
    },
    [dispatch],
  );

  function initCreateEventModal() {
    dispatch(resetNewEventState());
    hideCreateEventModal(true);
  }

  function handleEventTitle(e) {
    dispatch(updateNewEventBarProperties({ eventName: e.target.value }));
  }

  function handleEventMemo(e) {
    dispatch(updateNewEventBarProperties({ memo: e.target.value }));
  }

  function handleAllDay(e) {
    const [startDate, endDate] = calculateCurrentTimeRange(
      newEvent.startTime,
      newEvent.endTime,
    );

    dispatch(
      updateNewEventBarProperties({
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
        allDay: e.target.checked ? 1 : 0,
      }),
    );
  }

  function onClickListModalItem(e) {
    const [name, value] = [
      e.target.getAttribute('name'),
      +e.target.getAttribute('value'),
    ];

    if (name === 'calendarId') {
      dispatch(
        updateNewEventBarProperties({
          calendarId: value,
          calendarColor: calendars[value].color,
          eventColor: null,
        }),
      );
    } else {
      dispatch(updateNewEventBarProperties({ [name]: value }));
    }

    hideEventInfoListModal();
    e.stopPropagation();
  }

  function saveEvent() {
    dispatch(
      createEvent({
        ...newEvent,
        calendarId: calendars[newEvent.calendarId].id,
        startTime: new Date(newEvent.startTime).toISOString(),
        endTime: new Date(newEvent.endTime).toISOString(),
        color:
          newEvent.calendarColor === newEvent.eventColor
            ? null
            : newEvent.eventColor,
      }),
    );
    initCreateEventModal();
  }

  const [EventColorModal, EventInfoListModal] = ModalList;
  return (
    <Modal
      hideModal={initCreateEventModal}
      isCloseButtom
      isBackground
      style={{
        ...createEventModalData?.style,
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
                checked={newEvent.allDay ? true : false}
                onChange={handleAllDay}
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
                  showEventInfoListModal(e, EVENT.repeat(startDate), 'repeat')
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

            <Input
              type="text"
              placeholder="설명 추가"
              onBlur={handleEventMemo}
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
                {calendars[newEvent.calendarId].name}
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
              </h3>
              <EventColorOption
                colors={{
                  ...EVENT_COLOR,
                  ...(!Object.values(EVENT_COLOR).includes(
                    newEvent.calendarColor,
                  ) && {
                    '캘린더 색상': newEvent.calendarColor,
                  }),
                }}
                color={newEvent.eventColor || newEvent.calendarColor}
                changedColor={changeColor}
              />
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faBriefcase} />

            <div
              onClick={e => showEventInfoListModal(e, EVENT['busy'], 'busy')}
            >
              <h3 className={styles.list_modal}>
                {EVENT.busy[newEvent.busy]}
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
                  showEventInfoListModal(e, EVENT.permission, 'permission')
                }
              >
                {EVENT.permission[newEvent.permission]}
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
          <button onClick={saveEvent}>저장</button>
        </div>
      </div>
    </Modal>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};

export default Index;
