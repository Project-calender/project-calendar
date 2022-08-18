import React, { useRef, useState } from 'react';
import styles from './style.module.css';

import Modal from '../../../components/common/Modal';
import EventContainer from './EventContainer';
import { useSelector } from 'react-redux';
import { calendarByEventIdsSelector } from '../../../store/selectors/calendars';
import { useEffect } from 'react';
import { useContext } from 'react';
import { EventListModalContext } from '../../../context/EventModalContext';

const Index = () => {
  const { modalData, hideModal } = useContext(EventListModalContext);
  const { date, events, style } = modalData;

  const $modal = useRef();
  const [position, setPosition] = useState();
  const calendars = useSelector(state =>
    calendarByEventIdsSelector(state, events || []),
  );

  useEffect(() => {
    let { top = 0, left = 0 } = style || {};
    if (top + $modal.current?.offsetHeight + 30 > window.innerHeight) {
      top = window.innerHeight - $modal.current?.offsetHeight - 35;
    }

    if (left + $modal.current?.offsetWidth > window.innerWidth) {
      left = window.innerWidth - $modal.current?.offsetWidth - 65;
    }

    setPosition({ top, left });
  }, [style, events]);

  return (
    <Modal
      hideModal={hideModal}
      style={{ ...style, ...position }}
      isCloseButtom
    >
      <div className={styles.modal_container} ref={$modal}>
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

export default Index;
