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
} from '../../../../store/newEvent';

import useEventModal from '../../../../hooks/useEventModal';
import MiniCalendarModal from '../../MiniCalendarModal';
const Index = ({ showEventInfoListModal }) => {
  const [isDetail, setDetail] = useState(false);
  const newEvent = useSelector(newEventSelector);
  const [startDate, endDate] = [newEvent.startTime, newEvent.endTime].map(
    time => new Moment(time),
  );

  const dispatch = useDispatch();
  function handleAllDay(e, checked) {
    const [startDate, endDate] = calculateCurrentTimeRange(
      newEvent.startTime,
      newEvent.endTime,
    );

    dispatch(
      updateNewEventBarProperties({
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
        allDay:
          e.target?.checked || checked ? EVENT.allDay.true : EVENT.allDay.false,
      }),
    );
  }

  const {
    isModalShown: isMiniCalendarModalShown,
    showModal: showMiniCalendarModal,
    hideModal: hideMiniCalendarModal,
    modalData: miniCalendarModalData,
  } = useEventModal();

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

        <button
          className={styles.time_add_button}
          onClick={e => {
            setDetail(true);
            handleAllDay(e, false);
            e.stopPropagation();
          }}
        >
          시간 추가
        </button>
      </div>
    );
  }

  return (
    <>
      {isMiniCalendarModalShown && (
        <MiniCalendarModal
          hideModal={hideMiniCalendarModal}
          modalData={miniCalendarModalData}
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
          <h3
            onClick={e => {
              const { top, left } = e.target.getBoundingClientRect();
              showMiniCalendarModal({
                selectedDate: startDate,
                style: { top: top + 20, left },
              });
              e.stopPropagation();
            }}
          >
            {startDate.month}월 {startDate.date}일 ({startDate.weekDay}
            요일)
          </h3>
          {!newEvent.allDay && (
            <h3 className={styles.date_title_start}>
              {startDate.toTimeString()}
            </h3>
          )}
          <h3 className={styles.date_title_space}>-</h3>
          {!newEvent.allDay && (
            <h3 className={styles.date_title_end}>
              {!newEvent.allDay && endDate.toTimeString()}
            </h3>
          )}
          {(newEvent.allDay ||
            startDate.toSimpleDateString() !==
              endDate.toSimpleDateString()) && (
            <h3
              onClick={e => {
                const { top, left } = e.target.getBoundingClientRect();
                showMiniCalendarModal({
                  selectedDate: endDate,
                  style: { top: top + 20, left },
                });
                e.stopPropagation();
              }}
            >
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
              showEventInfoListModal(e, EVENT.repeat(startDate), 'repeat')
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
