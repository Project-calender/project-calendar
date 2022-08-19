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
  faGripLines,
  faLocationDot,
  faLock,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons';

import Input from '../../../components/common/Input';
import Modal from '../../../components/common/Modal';
import {
  CreateEventModalContext,
  EventInfoListModalContext,
} from '../../../context/EventModalContext';
import DateTitle from './DateTitle';
import InviteInput from './InviteInput';
import InviteMembers from './InviteMembers';

import { useDispatch, useSelector } from 'react-redux';
import {
  baseCalendarIndexSelector,
  calendarsByWriteAuthoritySelector,
} from '../../../store/selectors/calendars';

import EventColorOption from '../../../components/calendar/EventColorOption';
import { EVENT_COLOR } from '../../../styles/color';
import {
  resetNewEventState,
  updateNewEventBarProperties,
} from '../../../store/newEvent';
import { useCallback } from 'react';
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
        guests: inviteMembers.map(member => member.email),
      }),
    );
    initCreateEventModal();
  }

  const [isAddLocation, setAddLocation] = useState(false);
  const [isAddMemo, setAddMemo] = useState(false);
  const [isAddCalendar, setAddCalendar] = useState(false);

  const [EventColorModal, EventInfoListModal] = ModalList;
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
          <InviteMembers members={newEvent.inviteMembers} />
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
                <h4>첨부파일 추가</h4>
              </div>
              <div className={styles.modal_line} />
            </>
          )}

          {!isAddMemo && isAddCalendar && <div className={styles.modal_line} />}
          <div>
            <FontAwesomeIcon icon={faCalendarDay} />
            <div className={styles.calendar_info}>
              {!isAddCalendar ? (
                <div
                  className={styles.calendar_title}
                  onClick={e => {
                    setAddCalendar(true);
                    e.stopPropagation();
                  }}
                >
                  <h4>{calendars[newEvent.calendarId].name}</h4>
                  <div
                    className={styles.calendar_color}
                    style={{ background: newEvent.calendarColor }}
                  />
                  <h5>{`${EVENT.busy[newEvent.busy]} · ${
                    EVENT.permission[newEvent.permission]
                  } · 알리지 않음`}</h5>
                </div>
              ) : (
                <>
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
                    colors={
                      Object.values(EVENT_COLOR).includes(
                        newEvent.calendarColor,
                      )
                        ? EVENT_COLOR
                        : {
                            ...EVENT_COLOR,
                            '캘린더 색상': newEvent.calendarColor,
                          }
                    }
                    color={newEvent.eventColor || newEvent.calendarColor}
                    changedColor={changeColor}
                  />
                </>
              )}
            </div>
          </div>
          {isAddCalendar && (
            <>
              <div>
                <FontAwesomeIcon icon={faBriefcase} />

                <div
                  onClick={e =>
                    showEventInfoListModal(e, EVENT['busy'], 'busy')
                  }
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
            </>
          )}
        </div>
        {isAddCalendar && <div className={styles.modal_line} />}
      </div>
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
