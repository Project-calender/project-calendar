import React, { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { faCaretDown, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CheckBox from '../../../../components/common/CheckBox';
import Moment from '../../../../utils/moment';
import { EVENT } from '../../../../store/events';
import { useDispatch, useSelector } from 'react-redux';
import { newEventSelector } from '../../../../store/selectors/newEvent';
import {
  calculateCurrentTimeRange,
  updateNewEventBarProperties,
  updateNewEventTime,
} from '../../../../store/newEvent';

import useEventModal from '../../../../hooks/useEventModal';
import MiniCalendarModal from '../../MiniCalendarModal';
import TimeListModal from '../../TimeListModal';
import { useContext } from 'react';
import {
  EventColorModalContext,
  EventInfoListModalContext,
} from '../../../../context/EventModalContext';

const Index = ({ showEventInfoListModal }) => {
  const [isDetail, setDetail] = useState(false);
  const newEvent = useSelector(newEventSelector);
  const [startDate, endDate] = [newEvent.startTime, newEvent.endTime].map(
    time => new Moment(time),
  );

  const dispatch = useDispatch();
  function handleAllDay(e, checked) {
    const [startTime, endTime] =
      e.target?.checked || checked
        ? [newEvent.startTime, newEvent.endTime].map(
            time => new Moment(time).resetTime().time,
          )
        : calculateCurrentTimeRange(newEvent.startTime, newEvent.endTime);

    dispatch(
      updateNewEventBarProperties({
        startTime,
        endTime,
        allDay:
          e.target?.checked || checked ? EVENT.allDay.true : EVENT.allDay.false,
      }),
    );
  }

  const miniCalendarModal = useEventModal();
  const startTimeListModal = useEventModal();
  const endTimeListModal = useEventModal();

  function hideAllSubModal() {
    miniCalendarModal.hideModal();
    startTimeListModal.hideModal();
    endTimeListModal.hideModal();
  }

  function handleMiniCalendar(e, selectedDate) {
    hideAllSubModal();
    const { top, left } = e.target.getBoundingClientRect();
    miniCalendarModal.showModal({
      selectedDate,
      style: { top: top + 20, left },
    });
    e.stopPropagation();
  }

  function handleStartTimeList(e) {
    hideAllSubModal();
    const { top, left } = e.target.getBoundingClientRect();
    startTimeListModal.showModal({
      selectedItem: startDate.toTimeString(),
      style: { top: top + 30, left },
    });
    e.stopPropagation();
  }

  function handleEndTimeList(e) {
    hideAllSubModal();
    const { top, left } = e.target.getBoundingClientRect();
    endTimeListModal.showModal({
      selectedItem: endDate.toTimeString(),
      style: { top: top + 30, left },
    });
    e.stopPropagation();
  }

  const { hideModal: hideEventInfoListModal } = useContext(
    EventInfoListModalContext,
  );
  const { hideModal: hideEventColorModal } = useContext(EventColorModalContext);

  function clickAddTime(e) {
    setDetail(true);
    handleAllDay(e, false);
    hideEventInfoListModal();
    hideEventColorModal();
    e.stopPropagation();
  }

  if (!isDetail) {
    return (
      <div>
        <FontAwesomeIcon icon={faClock} />
        <div
          className={`${styles.date_title} ${styles.date_title_active}`}
          onClick={e => {
            setDetail(true);
            e.stopPropagation();
          }}
        >
          <h3>
            {startDate.month}월 {startDate.date}일 ({startDate.weekDay}
            요일)
          </h3>
          <h3 className={styles.date_title_space}>-</h3>
          <h3>
            {endDate.month}월 {endDate.date}일 ({endDate.weekDay}요일)
          </h3>
        </div>

        <button className={styles.time_add_button} onClick={clickAddTime}>
          시간 추가
        </button>
      </div>
    );
  }

  return (
    <>
      {miniCalendarModal.isModalShown && (
        <MiniCalendarModal
          hideModal={miniCalendarModal.hideModal}
          modalData={miniCalendarModal.modalData}
        />
      )}

      {startTimeListModal.isModalShown && (
        <TimeListModal
          hideModal={startTimeListModal.hideModal}
          modalData={startTimeListModal.modalData}
          onClickItem={e => {
            const date = new Date(+e.target.dataset.value);
            dispatch(
              updateNewEventTime({
                type: 'startTime',
                minute: date.getMinutes(),
                hour: date.getHours(),
              }),
            );
            startTimeListModal.hideModal();
            e.stopPropagation();
          }}
        />
      )}

      {endTimeListModal.isModalShown && (
        <TimeListModal
          hideModal={endTimeListModal.hideModal}
          modalData={endTimeListModal.modalData}
          onClickItem={e => {
            const date = new Date(+e.target.dataset.value);
            dispatch(
              updateNewEventTime({
                type: 'endTime',
                minute: date.getMinutes(),
                hour: date.getHours(),
              }),
            );
            endTimeListModal.hideModal();
            e.stopPropagation();
          }}
        />
      )}

      <div>
        <FontAwesomeIcon icon={faClock} />
        <div
          className={styles.date_title}
          onClick={e => {
            setDetail(true);
            e.stopPropagation();
          }}
        >
          <h3 onClick={e => handleMiniCalendar(e, { startDate })}>
            {startDate.month}월 {startDate.date}일 ({startDate.weekDay}
            요일)
          </h3>
          {!newEvent.allDay && (
            <h3
              className={styles.date_title_start}
              onClick={handleStartTimeList}
            >
              {startDate.toTimeString()}
            </h3>
          )}
          <h3 className={styles.date_title_space}>-</h3>
          {!newEvent.allDay && (
            <h3 className={styles.date_title_end} onClick={handleEndTimeList}>
              {!newEvent.allDay && endDate.toTimeString()}
            </h3>
          )}
          {(newEvent.allDay ||
            startDate.toSimpleDateString() !==
              endDate.toSimpleDateString()) && (
            <h3 onClick={e => handleMiniCalendar(e, { endDate })}>
              {endDate.month}월 {endDate.date}일 ({endDate.weekDay}요일)
            </h3>
          )}
        </div>
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
              showEventInfoListModal(e, {
                data: EVENT.repeat(startDate),
                name: 'repeat',
                selectedItem: EVENT.repeat(startDate)[newEvent.repeat],
              })
            }
          >
            {EVENT.repeat(startDate)[newEvent.repeat]}
            <FontAwesomeIcon className={styles.caret_down} icon={faCaretDown} />
          </h3>
        </div>
      </div>
    </>
  );
};

Index.propTypes = {
  showEventInfoListModal: PropTypes.func,
};

export default Index;
