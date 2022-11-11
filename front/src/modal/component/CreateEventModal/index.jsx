import React, { useContext, useEffect } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faBriefcase,
  faCalendarDay,
  faGripLines,
  faLocationDot,
  faLock,
} from '@fortawesome/free-solid-svg-icons';

import Input from '../../../components/common/Input';
import Line from '../../../components/common/Line';
import Modal from '../../../components/common/Modal';
import {
  CreateEventModalContext,
  EventColorModalContext,
  EventCustomAlertModalContext,
  EventDateModalContext,
  EventInfoListModalContext,
} from '../../../context/EventModalContext';
import DateTitleContainer from './DateTitleContainer';
import InviteInput from './InviteInput';
import InviteMemberList from './InviteMemberList';

import MemoPreviewContainer from './MemoPreviewContainer';
import MemoContainer from './MemoContainer';
import CalendarPreviewContainer from './CalendarPreviewContainer';
import CalendarContainer from './CalendarContainer';
import BusyContainer from './BusyContainer';
import PermissionContainer from './PermissionContainer';
import AlertContainer from './AlertContainer';
import GoogleMeetButton from './GoogleMeetButton';

import { useDispatch, useSelector } from 'react-redux';
import {
  baseCalendarIndexSelector,
  calendarsByWriteAuthoritySelector,
} from '../../../store/selectors/calendars';

import {
  resetNewEventState,
  updateNewEventAllDayAlert,
  updateNewEventBarProperties,
  updateNewEventNotAllDayAlert,
} from '../../../store/newEvent';
import { createEvent } from '../../../store/thunk/event';
import { newEventSelector } from '../../../store/selectors/newEvent';
import { EVENT } from '../../../store/events';
import { useState } from 'react';

const Index = ({ children: ModalList }) => {
  const createEventModal = useContext(CreateEventModalContext);
  const eventInfoListModal = useContext(EventInfoListModalContext);
  const eventCustomAlertModal = useContext(EventCustomAlertModalContext);
  const eventColorModal = useContext(EventColorModalContext);
  const { miniCalendarModal, startTimeListModal, endTimeListModal } =
    useContext(EventDateModalContext);

  const newEvent = useSelector(newEventSelector);
  const calendars = useSelector(calendarsByWriteAuthoritySelector);
  const baseCalendarIndex = useSelector(baseCalendarIndexSelector);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updateNewEventBarProperties({
        calendarId: baseCalendarIndex,
        calendarColor: calendars[baseCalendarIndex].color,
      }),
    );
  }, [dispatch, calendars, baseCalendarIndex]);

  function initCreateEventModal() {
    dispatch(resetNewEventState());
    createEventModal.hideModal(true);
  }

  function handleEventTitle(e) {
    dispatch(updateNewEventBarProperties({ eventName: e.target.value }));
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
          inviteMembers: {},
        }),
      );
    } else if (name.startsWith('alert')) {
      selectAlertItem(e, name, value);
    } else {
      dispatch(updateNewEventBarProperties({ [name]: value }));
    }
    eventInfoListModal.hideModal();
    e.stopPropagation();
  }

  function selectAlertItem(e, name, value) {
    const values =
      newEvent.allDay === EVENT.allDay.true
        ? EVENT.alerts.allDay.values
        : EVENT.alerts.notAllDay.values;

    const alertIndex = +name[name.length - 1];
    if (e.target.innerText === '맞춤...') {
      eventCustomAlertModal.showModal({ alertIndex });
      eventInfoListModal.hideModal();
      e.stopPropagation();
      return;
    }

    const updateNewEventAlert =
      newEvent.allDay === EVENT.allDay.true
        ? updateNewEventAllDayAlert
        : updateNewEventNotAllDayAlert;
    dispatch(updateNewEventAlert({ index: alertIndex, ...values[value] }));
  }

  function saveEvent() {
    const inviteMembers = Object.values(newEvent.inviteMembers).filter(
      member => member.canInvite,
    );

    const alerts =
      newEvent.allDay === EVENT.allDay.true
        ? newEvent.alerts.allDay
        : newEvent.alerts.notAllDay;
    const getAlertTitle =
      newEvent.allDay === EVENT.allDay.true
        ? EVENT.alerts.getAllDayTitle
        : EVENT.alerts.getNotAllDayTitle;
    const newAlerts = [
      ...new Map(alerts.map(alert => [getAlertTitle(alert), alert])).values(),
    ].sort(EVENT.alerts.ASC_SORT);

    dispatch(
      createEvent({
        ...newEvent,
        calendarId: calendars[newEvent.calendarId].id,
        color:
          newEvent.calendarColor === newEvent.eventColor
            ? null
            : newEvent.eventColor,
        startTime: new Date(newEvent.startTime).toISOString(),
        endTime: new Date(newEvent.endTime).toISOString(),
        guests: inviteMembers.map(member => member.id),
        alerts: newAlerts,
      }),
    );
    initCreateEventModal();
  }

  const [isAddLocation, setAddLocation] = useState(false);
  const [isAddMemo, setAddMemo] = useState(false);
  const [isAddCalendar, setAddCalendar] = useState(false);
  const isExistInviteMembers = Object.keys(newEvent.inviteMembers).length > 0;

  const isSubModalShown = [
    eventInfoListModal,
    eventCustomAlertModal,
    eventColorModal,
    miniCalendarModal,
    startTimeListModal,
    endTimeListModal,
  ].reduce(
    (isSubModalShown, modal) => isSubModalShown || modal.isModalShown,
    false,
  );

  const [EventInfoListModal, ...RestModal] = ModalList;

  return (
    <Modal
      hideModal={initCreateEventModal}
      isCloseButtom
      isBackground
      style={{
        ...createEventModal.modalData?.style,
        boxShadow: '2px 10px 24px 10px rgb(0, 0, 0, 0.25)',
        padding: '10px 0px',
        overflow: 'hidden',
      }}
    >
      {EventInfoListModal &&
        React.cloneElement(EventInfoListModal, {
          onClickItem: onClickListModalItem,
        })}
      {RestModal}

      <div className={styles.modal_header} name="modal-move-trigger">
        <FontAwesomeIcon icon={faGripLines} />
      </div>
      <div
        className={`${styles.modal_context} ${
          isSubModalShown ? styles.scroll_hidden : ''
        }`}
      >
        <div className={styles.event_title}>
          <div />
          <Input
            type="text"
            placeholder="제목 및 시간 추가"
            onBlur={handleEventTitle}
            autoFocus={true}
          />
        </div>
        <div>
          <div />
          <div className={styles.modal_context_category}>
            <button className={styles.category_active}>이벤트</button>
            <button>할 일</button>
          </div>
        </div>
        <DateTitleContainer
          showEventInfoListModal={eventInfoListModal.showModal}
        />
        <div className={styles.time_find}>
          <div />
          <button className={styles.time_find_button}>시간 찾기</button>
        </div>
        {isExistInviteMembers && <Line />}
        <InviteInput />
        <InviteMemberList members={newEvent.inviteMembers} />
        {isExistInviteMembers && <Line />}

        <GoogleMeetButton />

        {isAddLocation && <Line />}
        {!isAddLocation && (
          <div className={styles.event_info_input}>
            <FontAwesomeIcon icon={faLocationDot} />
            <div
              className={styles.invite_title}
              onClick={e => {
                setAddLocation(true);
                e.stopPropagation();
              }}
            >
              <h4>위치 추가</h4>
            </div>
          </div>
        )}
        {isAddLocation && (
          <div className={styles.event_info_input}>
            <FontAwesomeIcon icon={faLocationDot} />
            <Input
              type="text"
              placeholder="위치 추가"
              autoFocus={isAddLocation}
              onBlur={e => {
                if (!e.target.value) setAddLocation(false);
              }}
            />
          </div>
        )}
        {isAddLocation && <Line />}

        {isAddMemo && !isAddLocation && <Line />}
        {!isAddMemo && <MemoPreviewContainer setAddMemo={setAddMemo} />}
        {isAddMemo && <MemoContainer autoFocus={isAddMemo} />}
        {isAddMemo && <Line />}

        {!isAddMemo && isAddCalendar && <Line />}
        <div>
          <FontAwesomeIcon icon={faCalendarDay} />
          {!isAddCalendar && (
            <CalendarPreviewContainer setAddCalendar={setAddCalendar} />
          )}
          {isAddCalendar && (
            <CalendarContainer showListModal={eventInfoListModal.showModal} />
          )}
        </div>
        {isAddCalendar && (
          <>
            <div>
              <FontAwesomeIcon icon={faBriefcase} />
              <BusyContainer showListModal={eventInfoListModal.showModal} />
            </div>
            <div>
              <FontAwesomeIcon icon={faLock} />
              <PermissionContainer
                showListModal={eventInfoListModal.showModal}
              />
            </div>
            <div className={styles.alert}>
              <FontAwesomeIcon icon={faBell} />
              <AlertContainer showListModal={eventInfoListModal.showModal} />
            </div>
          </>
        )}
      </div>
      {isAddCalendar && <Line />}

      <div className={styles.modal_footer}>
        <button style={{ display: 'none' }}>옵션 더보기</button>
        <button onClick={saveEvent}>저장</button>
      </div>
    </Modal>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};

export default Index;
