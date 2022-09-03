import React, { useEffect, useState } from 'react';
import styles from './style.module.css';

import { useLocation, useNavigate } from 'react-router-dom';
import { getEventDetail, updateEvent } from '../../store/thunk/event';

import Input from '../../components/common/Input';
import CheckBox from '../../components/common/CheckBox';
import Tooltip from '../../components/common/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsStaggered,
  faBell,
  faCalendarDay,
  faCaretDown,
  faCircleQuestion,
  faClose,
  faLocationDot,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { EVENT } from '../../store/events';
import Select from '../../components/common/Select';
import Line from '../../components/common/Line';
import Moment from '../../utils/moment';

import EventColorOption from '../../components/calendar/EventColorOption';
import EventMemberList from '../../components/event/EventMemberList';

import EventColorModal from '../../modal/component/EventColorModal';
import CustomAlertOfAllDay from '../../components/alert/CustomAlertOfAllDay';
import CustomAlertOfNotAllDay from '../../components/alert/CustomAlertOfNotAllDay';
import { useDispatch, useSelector } from 'react-redux';
import { calendarsByWriteAuthoritySelector } from '../../store/selectors/calendars';
import { getAllCalendar } from '../../store/thunk/calendar';
import { EVENT_COLOR } from '../../styles/color';
import useEventModal from '../../hooks/useEventModal';
import { EventColorModalContext } from '../../context/EventModalContext.js';
const Index = () => {
  const { state: eventInfo } = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const calendars = useSelector(calendarsByWriteAuthoritySelector);

  useEffect(() => {
    const calendarIndex = calendars.findIndex(
      calendar =>
        calendar.id === (eventInfo.PrivateCalendarId || eventInfo.CalendarId),
    );
    if (calendarIndex > -1) {
      setEvent(event => ({ ...event, calendarIndex }));
    }
  }, [calendars]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCalendar());
    initEvent(eventInfo);
  }, []);

  async function initEvent(event) {
    const eventData = await getEventDetail(event);
    eventData.EventMembers =
      eventData.EventMembers?.reduce((obj, member) => {
        obj[member.email] = { ...member, canInvite: false };
        return obj;
      }, {}) || {};

    setEvent({
      ...event,
      ...eventData,
      alerts:
        eventData.allDay === EVENT.allDay.true
          ? { allDay: eventData.alerts, notAllDay: [] }
          : { allDay: [], notAllDay: eventData.alerts },
    });
  }

  const eventColorModal = useEventModal();
  const eventColorModalContext = {
    ...eventColorModal,
    showModal: showEventColorModal,
  };

  function showEventColorModal(e, colorData) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    eventColorModal.showModal({
      ...colorData,
      style: { top, left },
    });
    e.stopPropagation();
  }

  if (!event || !event.id || event.calendarIndex < 0) return;

  const [startDate, endDate] = [event.startTime, event.endTime].map(
    time => new Moment(new Date(time)),
  );

  function clickAddAlert(e) {
    e.stopPropagation();
    if (event.allDay === EVENT.allDay.true) {
      return { type: '일', time: 1, hour: 9, minute: 0 };
    } else {
      return { type: '분', time: 30 };
    }
  }

  function saveEvent() {
    const inviteMembers = Object.values(event.EventMembers).filter(
      member => member.canInvite,
    );

    const alerts =
      event.allDay === EVENT.allDay.true
        ? event.alerts.allDay
        : event.alerts.notAllDay;
    const getAlertTitle =
      event.allDay === EVENT.allDay.true
        ? EVENT.alerts.getAllDayTitle
        : EVENT.alerts.getNotAllDayTitle;
    const newAlerts = [
      ...new Map(alerts.map(alert => [getAlertTitle(alert), alert])).values(),
    ].sort(EVENT.alerts.ASC_SORT);

    dispatch(
      updateEvent({
        ...event,
        calendarId: calendars[event.calendarIndex].id,
        color:
          event.calendarColor === event.eventColor ? null : event.eventColor,
        startTime: new Date(event.startTime).toISOString(),
        endTime: new Date(event.endTime).toISOString(),
        guests: inviteMembers.map(member => member.email),
        alerts: newAlerts,
      }),
    );
  }

  const isAllDay = event.allDay === EVENT.allDay.true;
  const alerts = isAllDay ? event.alerts.allDay : event.alerts.notAllDay;
  return (
    <>
      <div className={styles.date_title_conitner}>
        <Tooltip title="일정 변경 취소" top={0} left={10}>
          <FontAwesomeIcon
            icon={faClose}
            className={styles.icon_close}
            onClick={() => navigate(-1)}
          />
        </Tooltip>
        <div className={styles.date_title}>
          <div className={styles.date_title_input}>
            <Input
              value={event.name}
              placeholder="제목 추가"
              onChange={e => {
                setEvent(event => ({ ...event, name: e.target.value }));
              }}
            />
            <button onClick={saveEvent}>저장</button>
            <button>
              추가 작업 <FontAwesomeIcon icon={faCaretDown} />
            </button>
          </div>
          <div className={styles.event_time_container}>
            <Input
              value={startDate.toDateString()}
              className={styles.input_fill}
            />
            {event.allDay === EVENT.allDay.false && (
              <Input
                value={startDate.toTimeString()}
                className={`${styles.input_fill} ${styles.time_input}`}
              />
            )}
            <em>-</em>
            {event.allDay === EVENT.allDay.false && (
              <Input
                value={endDate.toTimeString()}
                className={`${styles.input_fill} ${styles.time_input}`}
              />
            )}
            <Input
              value={endDate.toDateString()}
              className={styles.input_fill}
            />
          </div>
          <div className={styles.allDay_title}>
            <CheckBox
              checked={event.allDay === EVENT.allDay.true}
              onChange={e => {
                setEvent(event => ({
                  ...event,
                  allDay: e.target.checked
                    ? EVENT.allDay.true
                    : EVENT.allDay.false,
                }));
              }}
            >
              <em>종일</em>
            </CheckBox>
            <Select name="repact" itemList={EVENT.repeat(startDate)} />
          </div>
        </div>
      </div>
      <div className={styles.edit_page_main}>
        <div className={styles.edit_page_main_left}>
          <div>
            <div />
            <div className={styles.nav_select}>
              <span>일정 세부 정보</span>
              <span>참석자 및 리소스</span>
              <div className={styles.line_pointer} />
              <Line />
            </div>
          </div>
          <div className={styles.google_meet}>
            <img
              src={`${process.env.PUBLIC_URL}/img/google_meet_icon.png`}
              alt="구글 미팅"
            />
            <button>
              <b>Google Meet</b> 화상 회의 추가
            </button>
          </div>
          <div>
            <FontAwesomeIcon icon={faLocationDot} />
            <Input
              value={event.location}
              placeholder="위치 추가"
              onChange={e => {
                setEvent(event => ({ ...event, location: e.target.value }));
              }}
              className={styles.input_fill}
            />
          </div>
          <div>
            <FontAwesomeIcon icon={faBell} />
            <div>
              {isAllDay
                ? event.alerts.allDay.map((alert, index) => (
                    <div key={index} className={styles.alert_item}>
                      <CustomAlertOfAllDay alert={alert} />
                      <Tooltip title="알림 삭제">
                        <FontAwesomeIcon
                          icon={faClose}
                          className={styles.icon_close}
                        />
                      </Tooltip>
                    </div>
                  ))
                : event.alerts.notAllDay.map((alert, index) => (
                    <div key={index} className={styles.alert_item}>
                      <CustomAlertOfNotAllDay alert={alert} />
                      <Tooltip title="알림 삭제">
                        <FontAwesomeIcon
                          icon={faClose}
                          className={styles.icon_close}
                        />
                      </Tooltip>
                    </div>
                  ))}
              {alerts.length < 5 && (
                <button
                  className={styles.add_alert_button}
                  onClick={clickAddAlert}
                >
                  알림 추가
                </button>
              )}
            </div>
          </div>
          <div className={styles.calendar_container}>
            <FontAwesomeIcon icon={faCalendarDay} />
            <Select
              name="calendar"
              itemList={calendars.map(calendar => calendar.name)}
              selectedItem={calendars[event.calendarIndex]?.name}
              onChange={e => {
                console.log(e.target.getAttribute('value'));
                setEvent(event => ({
                  ...event,
                  calendarIndex: +e.target.getAttribute('value'),
                }));
              }}
            />
            <EventColorModalContext.Provider value={eventColorModalContext}>
              <EventColorOption
                colors={EVENT_COLOR}
                color={event?.color || calendars[event.calendarIndex]?.color}
              />
              {eventColorModal.isModalShown && <EventColorModal />}
            </EventColorModalContext.Provider>
          </div>
          <div className={styles.busy_container}>
            <FontAwesomeIcon icon={faLock} />
            <Select
              name="busy"
              itemList={EVENT.busy}
              selectedItem={EVENT.busy[event.busy]}
              onChange={e => {
                setEvent(event => ({
                  ...event,
                  busy: +e.target.getAttribute('value'),
                }));
              }}
            />
            <Select
              name="permission"
              itemList={EVENT.permission}
              selectedItem={EVENT.permission[event.permission]}
              onChange={e => {
                setEvent(event => ({
                  ...event,
                  permission: +e.target.getAttribute('value'),
                }));
              }}
            />
            <FontAwesomeIcon
              icon={faCircleQuestion}
              className={styles.icon_question}
            />
          </div>
          <div>
            <FontAwesomeIcon icon={faBarsStaggered} />
            <Input
              value={event.memo}
              placeholder="설명 추가"
              onChange={e => {
                setEvent(event => ({ ...event, memo: e.target.value }));
              }}
              className={styles.input_fill}
            />
          </div>
        </div>

        <div className={styles.edit_page_main_right}>
          <div className={styles.nav_select}>
            <span>참석자</span>
            <div className={styles.line_pointer} />
            <Line />
          </div>
          <EventMemberList eventMembers={event.EventMembers} />
        </div>
      </div>
    </>
  );
};

export default Index;
