import React, { useEffect, useRef, useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { EVENT } from '../../../store/events';
import { calendarByEventIdsSelector } from '../../../store/selectors/calendars';
import { useSelector } from 'react-redux';

const Index = ({ item, clickEventBar = () => {} }) => {
  let eventItem = useRef(); //이벤트 아이템
  let [clickEvent, setClickEvent] = useState(); //클릭한 이벤트 index
  let calendars = useSelector(state => calendarByEventIdsSelector(state, item));

  //외부 클릭시 className 제거
  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside);

    return () => {
      document.removeEventListener('mousedown', clickModalOutside);
    };
  });

  //외부 클릭시 className 제거
  function clickModalOutside(event) {
    if (!eventItem.current.contains(event.target)) {
      setClickEvent(-1);
    }
  }

  return (
    <div ref={eventItem}>
      {item &&
        item.map((item, index) => {
          return (
            <div
              key={index}
              className={
                clickEvent == item.id
                  ? `${styles.active} ${styles.event_wrap}`
                  : styles.event_wrap
              }
              onClick={e => {
                clickEventBar(e, item);
                setClickEvent(item.id);
              }}
            >
              <div className={styles.all_day}>
                {item.allDay == EVENT.allDay.true ||
                item.endTime.substr(5, 5).replace('-', '') -
                  item.startTime.substr(5, 5).replace('-', '') >
                  1 ? (
                  <div>
                    <span
                      style={{
                        background: item?.color || calendars[index]?.color,
                      }}
                    ></span>
                    <em>종일</em>
                  </div>
                ) : (
                  <div>
                    <span
                      style={{
                        background:
                          (item && item.color) ||
                          (calendars && calendars[index].color),
                      }}
                    ></span>
                    <em>
                      {new Date(item.startTime).getHours()} :{' '}
                      {new Date(item.startTime).getMinutes()} ~{' '}
                      {new Date(item.endTime).getHours()} :{' '}
                      {new Date(item.endTime).getMinutes()}
                    </em>
                  </div>
                )}
              </div>
              <div className={styles.content}>
                <p>
                  {item.name || '(제목 없음)'} {item.nameType}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};
Index.propTypes = {
  item: PropTypes.array,
  clickEventBar: PropTypes.func,
};

export default Index;
