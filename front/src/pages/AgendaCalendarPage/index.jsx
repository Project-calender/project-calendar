import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import useEventModal from '../../hooks/useEventModal';
import axios from '../../utils/token';
import styles from './style.module.css';
import EventDetailModal from '../../modal/component/EventDetailModal';
import { deleteEvent, getEventDetail } from '../../store/thunk/event';
import { checkedCalendarSelector } from '../../store/selectors/user';
import { useDispatch, useSelector } from 'react-redux';
import { isCheckedCalander } from '../../store/user';
import { EVENT_URL } from '../../constants/api';
import EventItem from './EventItem';
import { selectedDateSelector } from '../../store/selectors/date';
import Moment from '../../utils/moment';

const Index = () => {
  let calendarCheck = useSelector(checkedCalendarSelector);
  let { isModalShown, showModal, hideModal, modalData, setModalData } =
    useEventModal();
  //let [toDay, setToDay] = useState(); //오늘 날짜
  let [nextDay, setNextDay] = useState(); //다음 해 날짜
  let [allEvent, setAllEvent] = useState(); //모든 이벤트
  let [filterEvent, setFilterEvent] = useState(); //필터된 이벤트
  let date = useSelector(selectedDateSelector); //날짜 가지고 오기
  const year = date.year;
  const month = ('0' + date.month).slice(-2);
  const day = ('0' + date.date).slice(-2);

  useEffect(() => {
    onEvent();
  }, [calendarCheck, date]);

  function onEvent() {
    axios
      .post(EVENT_URL.GET_ALL_EVENT, {
        startTime: `${year}-${month}-${day}`,
      })
      .then(res => {
        setAllEvent(res.data);
      });
  }

  useEffect(() => {
    //const dateStr = year + month + day;
    const nextDay = year + 1 + month + day;
    //setToDay(dateStr); //오늘 날짜 저장
    setNextDay(nextDay); //오늘 날짜 기준 다음 년 날짜 저장
    eventFilter();
  }, [allEvent, date]);

  function eventFilter() {
    //let copyAllEvent = allEvent && [...allEvent];
    let newAllEvent = allEvent && [...allEvent];

    //날짜 순으로 정렬
    /*
    let newAllEvent =
      allEvent &&
      copyAllEvent.sort(function (a, b) {
        return (
          a.startTime.substr(0, 10).replaceAll('-', '') -
          b.startTime.substr(0, 10).replaceAll('-', '')
        );
      });

    // 현재 날짜 기준으로 필터

    newAllEvent =
      newAllEvent &&
      newAllEvent
        .filter(a => {
          let date = new Date(a.endTime);
          const year = date.getFullYear();
          const month = ('0' + (date.getMonth() + 1)).slice(-2);
          const day = ('0' + date.getDate()).slice(-2);
          const dateStr = year + month + day;

          return dateStr >= toDay && dateStr <= nextDay;
        })
        */
    newAllEvent = newAllEvent && newAllEvent.filter(isCheckedCalander); //캘린더에 체크된 이벤트만 필터

    let event = newAllEvent?.reduce((obj, event) => {
      const startDate = new Moment(new Date(event.startTime));
      const endDate = new Moment(new Date(event.endTime));

      if (startDate.resetTime().time === endDate.resetTime().time) {
        obj[startDate.time] = obj[startDate.time] || [];
        obj[startDate.time].push(event);
      } else {
        for (
          let date = startDate, index = 1;
          date.time <= endDate.time;
          date = date.addDate(1), index++
        ) {
          obj[date.time] = obj[date.time] || [];
          obj[date.time].push({
            ...event,
            nameType: `(${index}/${
              startDate.calculateDateDiff(endDate.time) + 1
            }일)`,
          });
        }
      }
      return obj;
    }, {});

    setFilterEvent(event); //필터된 이벤트 배열로 저장
  }

  //이벤트 팝업창 컨트롤
  async function clickEventBar(e, event) {
    e.stopPropagation();

    const { top, right } = e.currentTarget.getBoundingClientRect();
    const eventData = await getEventDetail(event);
    if (!isModalShown) showModal();
    setModalData({
      event: eventData,
      style: { top: top, left: right },
    });
  }

  const dispatch = useDispatch();
  async function onDeleteEvent(event) {
    dispatch(deleteEvent(event));
    setAllEvent(events =>
      events.filter(
        target =>
          target.CalendarId !== event.CalendarId || target.id !== event.id,
      ),
    );
    return event.id;
  }

  return (
    <>
      {isModalShown && (
        <EventDetailModal
          hideModal={hideModal}
          modalData={modalData}
          onDeleteEvent={onDeleteEvent}
        />
      )}
      <div className={styles.container}>
        {filterEvent && Object.keys(filterEvent).length == 0 ? (
          <div className={styles.search_undefined}>
            <em>이벤트 결과가 없습니다.</em>
          </div>
        ) : null}
        {filterEvent && (
          <ul>
            {Object.entries(filterEvent).map(function ([time, item], index) {
              if (+time < date.time) return;
              return (
                <li key={index}>
                  <div className={styles.time}>
                    <div className={styles.day}>
                      <em>{new Date(+time).getDate()}</em>
                    </div>
                    <div className={styles.year}>
                      <p>
                        {new Date(+time).getFullYear()}년
                        {new Date(+time).getMonth() + 1}월
                      </p>
                    </div>
                  </div>
                  <div className={styles.wrap}>
                    <EventItem
                      item={item}
                      clickEventBar={clickEventBar}
                    ></EventItem>
                  </div>
                </li>
              );
            })}
            <em>
              {nextDay.slice(0, 4)}년{nextDay.slice(4, 6)}월
              {nextDay.slice(6, 8)}일까지의 일정을 표시합니다.
            </em>
          </ul>
        )}
      </div>
    </>
  );
};

export default Index;
