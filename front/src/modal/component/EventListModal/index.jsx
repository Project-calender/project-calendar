import React, { useRef, useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../components/common/Modal';
import EventContainer from './EventContainer';
import { useSelector } from 'react-redux';
import { calendarByEventIdsSelector } from '../../../store/selectors/calendars';
import { useEffect } from 'react';

const Index = ({ modalData, hideModal }) => {
  const { date, events, style } = modalData;

  const $modal = useRef();
  const [position, setPosition] = useState();
  useEffect(() => {
    [...document.getElementsByClassName('event_bar_div')].forEach($eventBar => {
      $eventBar.classList.remove(styles.event_bar_active);
    });

    let { top = 0, left = 0 } = style || {};
    if (top + $modal.current?.offsetHeight + 30 > window.innerHeight) {
      top = window.innerHeight - $modal.current?.offsetHeight - 35;
    }

    if (left + $modal.current?.offsetWidth > window.innerWidth) {
      left = window.innerWidth - $modal.current?.offsetWidth - 65;
    }

    setPosition({ top, left });
  }, [style, events]);

  function handleEventBarStyle(e) {
    [...document.getElementsByClassName('event_bar_div')].forEach($eventBar => {
      if (e.nativeEvent.path.includes($eventBar)) {
        $eventBar.classList.add(styles.event_bar_active);
      } else {
        $eventBar.classList.remove(styles.event_bar_active);
      }
    });
    e.stopPropagation();
  }

  const calendars = useSelector(state =>
    calendarByEventIdsSelector(state, events || []),
  );

  return (
    <Modal
      hideModal={hideModal}
      style={{ ...style, ...position }}
      isCloseButtom={true}
    >
      <div
        className={styles.modal_container}
        ref={$modal}
        onClick={handleEventBarStyle}
      >
        <strong>{date.weekDay}</strong>
        <h1>{date.date}</h1>
        {events.length ? (
          events.map((event, index) => (
            <EventContainer
              key={index}
              event={event}
              calendar={calendars[index]}
              date={date}
            />
          ))
        ) : (
          <p>이 날짜에는 예정된 일정이 없습니다.</p>
        )}
      </div>
    </Modal>
  );
};

Index.propTypes = {
  modalData: PropTypes.object,
  hideModal: PropTypes.func,
};

export default Index;
