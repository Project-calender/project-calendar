import React, { useContext, useEffect } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsStaggered,
  faBell,
  faBriefcase,
  faCalendarDay,
  faGripLines,
  faLocationDot,
  faLock,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons';

import Input from '../../../components/common/Input';
import Modal from '../../../components/common/Modal';
import {
  CreateEventModalContext,
  EventCustomAlertModalContext,
  EventInfoListModalContext,
} from '../../../context/EventModalContext';
import DateTitle from './DateTitle';
import InviteInput from './InviteInput';
import InviteMemberList from './InviteMemberList';

import CalendarPreviewContainer from './CalendarPreviewContainer';
import CalendarContainer from './CalendarContainer';
import BusyContainer from './BusyContainer';
import PermissionContainer from './PermissionContainer';
import AlertContainer from './AlertContainer';

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
import { useRef } from 'react';

const Index = ({ children: ModalList }) => {
  const dispatch = useDispatch();
  const { hideModal: hideCreateEventModal, modalData: createEventModalData } =
    useContext(CreateEventModalContext);
  const {
    showModal: showEventInfoListModal,
    hideModal: hideEventInfoListModal,
  } = useContext(EventInfoListModalContext);
  const { showModal: showEventCustomAlertModal } = useContext(
    EventCustomAlertModalContext,
  );
  const newEvent = useSelector(newEventSelector);

  const calendars = useSelector(calendarsByWriteAuthoritySelector);
  const baseCalendarIndex = useSelector(baseCalendarIndexSelector);
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
    hideCreateEventModal(true);
  }

  function handleEventTitle(e) {
    dispatch(updateNewEventBarProperties({ eventName: e.target.value }));
  }

  function handleEventMemo(e) {
    dispatch(updateNewEventBarProperties({ memo: e.target.value }));
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
      const values =
        newEvent.allDay === EVENT.allDay.true
          ? EVENT.alerts.allDay.values
          : EVENT.alerts.notAllDay.values;
      const alertIndex = +name[name.length - 1];

      if (value === values.length) {
        showEventCustomAlertModal({ alertIndex });
        hideEventInfoListModal();
        e.stopPropagation();
        return;
      }

      if (newEvent.allDay === EVENT.allDay.true) {
        dispatch(
          updateNewEventAllDayAlert({
            index: alertIndex,
            ...values[value],
          }),
        );
      }

      if (newEvent.allDay === EVENT.allDay.false) {
        dispatch(
          updateNewEventNotAllDayAlert({
            index: alertIndex,
            ...values[value],
          }),
        );
      }
    } else {
      dispatch(updateNewEventBarProperties({ [name]: value }));
    }
    hideEventInfoListModal();
    e.stopPropagation();
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
        guests: inviteMembers.map(member => member.email),
        alerts: newAlerts,
      }),
    );
    initCreateEventModal();
  }

  const [isAddLocation, setAddLocation] = useState(false);
  const [isAddMemo, setAddMemo] = useState(false);
  const [isAddCalendar, setAddCalendar] = useState(false);

  const [EventColorModal, EventInfoListModal, EventCustomAlertModal] =
    ModalList;
  const modalRef = useRef();

  return (
    <Modal
      hideModal={initCreateEventModal}
      isCloseButtom
      isBackground
      style={{
        ...createEventModalData?.style,
        boxShadow: '2px 10px 24px 10px rgb(0, 0, 0, 0.25)',
        padding: '10px 0px',
      }}
    >
      {EventColorModal}
      {EventInfoListModal &&
        React.cloneElement(EventInfoListModal, {
          onClickItem: onClickListModalItem,
        })}
      {EventCustomAlertModal}

      <div className={styles.modal_container} ref={modalRef}>
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
          <DateTitle showEventInfoListModal={showEventInfoListModal} />
          <div className={styles.time_find}>
            <div />
            <button className={styles.time_find_button}>시간 찾기</button>
          </div>

          {Object.keys(newEvent.inviteMembers).length > 0 && (
            <div className={styles.modal_line} />
          )}
          <InviteInput />
          <InviteMemberList members={newEvent.inviteMembers} />
          {Object.keys(newEvent.inviteMembers).length > 0 && (
            <div className={styles.modal_line} />
          )}

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
          <>
            {isAddLocation && <div className={styles.modal_line} />}
            <div className={styles.event_info_input}>
              <FontAwesomeIcon icon={faLocationDot} />
              {!isAddLocation ? (
                <div
                  className={styles.invite_title}
                  onClick={e => {
                    setAddLocation(true);
                    e.stopPropagation();
                  }}
                >
                  <h4>위치 추가</h4>
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder="위치 추가"
                  autoFocus={isAddLocation}
                  onBlur={e => {
                    if (!e.target.value) setAddLocation(false);
                  }}
                />
              )}
            </div>
            {isAddLocation && <div className={styles.modal_line} />}
          </>

          {isAddMemo && !isAddLocation && <div className={styles.modal_line} />}
          <div className={styles.memo}>
            <FontAwesomeIcon icon={faBarsStaggered} />

            {!isAddMemo ? (
              <div
                className={styles.invite_title}
                onClick={e => {
                  setAddMemo(true);
                  e.stopPropagation();
                }}
              >
                <h4>설명 또는 첨부파일 추가</h4>
              </div>
            ) : (
              <Input
                type="text"
                placeholder="설명 추가"
                onBlur={handleEventMemo}
                autoFocus={isAddMemo}
              />
            )}
          </div>
          {isAddMemo && (
            <>
              <div>
                <FontAwesomeIcon
                  icon={faPaperclip}
                  className={styles.clip_icon}
                />
                <h4 className={styles.file_title}>첨부파일 추가</h4>
              </div>
              <div className={styles.modal_line} />
            </>
          )}

          {!isAddMemo && isAddCalendar && <div className={styles.modal_line} />}
          <div>
            <FontAwesomeIcon icon={faCalendarDay} />
            {!isAddCalendar && (
              <CalendarPreviewContainer setAddCalendar={setAddCalendar} />
            )}
            {isAddCalendar && (
              <CalendarContainer showListModal={showEventInfoListModal} />
            )}
          </div>
          {isAddCalendar && (
            <>
              <div>
                <FontAwesomeIcon icon={faBriefcase} />
                <BusyContainer showListModal={showEventInfoListModal} />
              </div>
              <div>
                <FontAwesomeIcon icon={faLock} />
                <PermissionContainer showListModal={showEventInfoListModal} />
              </div>
              <div className={styles.alert}>
                <FontAwesomeIcon icon={faBell} />
                <AlertContainer showListModal={showEventInfoListModal} />
              </div>
            </>
          )}
        </div>
      </div>
      {isAddCalendar && <div className={styles.modal_footer_line} />}
      <div className={styles.modal_footer}>
        <button>옵션 더보기</button>
        <button onClick={saveEvent}>저장</button>
      </div>
    </Modal>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};

export default Index;
