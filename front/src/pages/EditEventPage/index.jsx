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
  faCheck,
  faCircleQuestion,
  faClose,
  faLocationDot,
  faLock,
  faQuestion,
  faQuestionCircle,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { EVENT } from '../../store/events';
import Select from '../../components/common/Select';
import Moment from '../../utils/moment';

import EventColorOption from '../../components/calendar/EventColorOption';
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

  const [helfModalPosition, setHelfModalStyle] = useState({});

  function moveHelfModal(e) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    if (helfModalPosition.top !== top)
      setHelfModalStyle({ top, left: left + 20, visibility: 'visible' });
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

  const EVENT_STATE_KEY = Object.keys(EVENT.state);
  const EVENT_STATE = {
    accept: { message: '초대 수락', icon: faCheck },
    refuse: { message: '초대 거절', icon: faXmark },
    toBeDetermined: { message: '미정으로 응답', icon: faQuestion },
    default: { message: '회신 대기 중', icon: null },
  };

  const membersByState =
    Object.values(event.EventMembers).reduce(
      (membersByState, member) => {
        membersByState[EVENT_STATE_KEY[member.EventMember.state]].push(member);
        return membersByState;
      },
      Object.keys(EVENT_STATE).reduce((membersByState, state) => {
        membersByState[state] = [];
        return membersByState;
      }, {}),
    ) || {};

  const memberStateTitle = Object.entries(membersByState)
    .map(([state, members]) =>
      members.length ? `${EVENT_STATE[state].message} ${members.length}명` : '',
    )
    .filter(text => text)
    .join(', ');

  const isExistCanNotInviteMember = Object.values(event.EventMembers).find(
    member => !member.canInvite,
  );

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
        <Input placeholder={'참석자 추가'} />
        <p>참석자 {Object.keys(event.EventMembers).length}명</p>
        <em>{memberStateTitle}</em>

        {Object.values(event.EventMembers).map(member => (
          <div key={member.id} className={styles.user_info}>
            <div className={styles.user_profile}>
              <img src={member.ProfileImages[0].src} alt="profile" />
              {member.EventMember.state ? (
                <FontAwesomeIcon
                  className={`${styles.user_state} ${
                    styles[EVENT_STATE_KEY[member.EventMember.state]]
                  }`}
                  icon={
                    EVENT_STATE[EVENT_STATE_KEY[member.EventMember.state]].icon
                  }
                />
              ) : null}
            </div>
            <h3>
              {member.email} {!member.canInvite && <em>*</em>}
            </h3>
          </div>
        ))}

        {isExistCanNotInviteMember && (
          <div className={styles.help_container}>
            <em>* 캘린더를 표시할 수 없습니다.</em>
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className={styles.icon_help}
              onMouseOver={moveHelfModal}
              onMouseLeave={() => {
                setHelfModalStyle({ visibility: 'hidden' });
              }}
            />
            <div className={styles.help_modal} style={helfModalPosition}>
              <p>
                Google Calendar에서 다음 이유 중 하나로 인해 표시된 참석자를
                확인할 수 없습니다.
              </p>
              <ul>
                <li>참석자가 Google Calendar를 사용하지 않을 수 있습니다.</li>
                <li>표시된 캘린더에 엑세스할 권한이 없을 수도 있습니다.</li>
                <li>
                  200명 이상의 참석자가 포함된 그룹을 초대했을 수 있습니다.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
