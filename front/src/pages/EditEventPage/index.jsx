import React, { useEffect, useState } from 'react';
import styles from './style.module.css';

import { useLocation } from 'react-router-dom';
import { getEventDetail } from '../../store/thunk/event';

import Input from '../../components/common/Input';
import CheckBox from '../../components/common/CheckBox';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsStaggered,
  faBell,
  faCalendarDay,
  faCircleQuestion,
  faClose,
  faLocationDot,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { EVENT } from '../../store/events';
import Select from '../../components/common/Select';
import Moment from '../../utils/moment';

import EventColorOption from '../../components/calendar/EventColorOption';
import EventMemberList from '../../components/event/EventMemberList';

import GoogleMeetButton from '../../modal/component/CreateEventModal/GoogleMeetButton';
import EventColorModal from '../../modal/component/EventColorModal';
import CustomAlertOfAllDay from '../../components/alert/CustomAlertOfAllDay';
import CustomAlertOfNotAllDay from '../../components/alert/CustomAlertOfNotAllDay';
import { useDispatch, useSelector } from 'react-redux';
import {
  calendarByEventIdSelector,
  calendarsByWriteAuthoritySelector,
} from '../../store/selectors/calendars';
import { getAllCalendar } from '../../store/thunk/calendar';
import { EVENT_COLOR } from '../../styles/color';
import useEventModal from '../../hooks/useEventModal';
import { EventColorModalContext } from '../../context/EventModalContext.js';
const Index = () => {
  const { state: eventIds } = useLocation();
  const [event, setEvent] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchEventDetail(eventIds);
    dispatch(getAllCalendar());
  }, []);

  async function fetchEventDetail(event) {
    const eventData = await getEventDetail(event);
    eventData.EventMembers =
      eventData.EventMembers?.reduce((obj, member) => {
        obj[member.email] = { ...member, canInvite: false };
        return obj;
      }, {}) || {};
    setEvent(eventData);
  }
  const calendars = useSelector(calendarsByWriteAuthoritySelector);
  const calendar = useSelector(state =>
    calendarByEventIdSelector(state, event),
  );
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

  if (!event) return;

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

  return (
    <div className={styles.edit_page}>
      수정 페이지
      <div>
        <FontAwesomeIcon icon={faClose} onClick={() => {}} />
        <div>
          <Input value={event.name} />
          <button>저장</button>
          <button>추가 작업</button>
        </div>
      </div>
      <div>
        <div>
          <Input value={startDate.toDateString()} />
          <Input value={endDate.toDateString()} />
        </div>
        <div>
          <CheckBox checked={event.allDay === EVENT.allDay.true}>
            <em>종일</em>
          </CheckBox>
          <Select name="repact" itemList={EVENT.repeat(startDate)} />
        </div>
      </div>
      <GoogleMeetButton />
      <div>
        <FontAwesomeIcon icon={faLocationDot} />
        <Input placeholder="위치 추가" />
      </div>
      <div>
        <FontAwesomeIcon icon={faBell} />
        {event.allDay === EVENT.allDay.true
          ? event.alerts.map((alert, index) => (
              <div key={index} className={styles.alert_item}>
                <CustomAlertOfAllDay alert={alert} />
                <FontAwesomeIcon icon={faClose} />
              </div>
            ))
          : event.alerts.map((alert, index) => (
              <div key={index} className={styles.alert_item}>
                <CustomAlertOfNotAllDay alert={alert} />
                <FontAwesomeIcon icon={faClose} />
              </div>
            ))}
        {event.alerts.length < 5 && <h3 onClick={clickAddAlert}>알림 추가</h3>}
      </div>
      <div>
        <FontAwesomeIcon icon={faCalendarDay} />
        <Select
          name="calendar"
          itemList={calendars.map(calendar => calendar.name)}
          selectedItem={calendar?.name}
        />
        <EventColorModalContext.Provider value={eventColorModalContext}>
          <EventColorOption
            colors={EVENT_COLOR}
            color={event?.color || calendar?.color}
          />
          {eventColorModal.isModalShown && <EventColorModal />}
        </EventColorModalContext.Provider>
      </div>
      <div>
        <FontAwesomeIcon icon={faLock} />
        <Select name="busy" itemList={EVENT.busy} />
        <FontAwesomeIcon icon={faCircleQuestion} />
      </div>
      <div>
        <FontAwesomeIcon icon={faBarsStaggered} />
        {event.memo}
      </div>
      <div>
        <EventMemberList eventMembers={event.EventMembers} />
      </div>
    </div>
  );
};

export default Index;
