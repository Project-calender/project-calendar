import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.css';
import EventDetailModal from '../../modal/component/EventDetailModal';
import useEventModal from '../../hooks/useEventModal';
import { EVENT } from '../../store/events';
import { getEventDetail } from '../../store/thunk/event';

const Index = () => {
  let { isModalShown, showModal, hideModal, modalData, setModalData } =
    useEventModal();
  let [clickEvent, setClickEvent] = useState(); //클릭한 이벤트 index
  let eventItem = useRef(); //이벤트 아이템
  let [searchFilter, setSearchFilter] = useState();

  //redux 검색 정보 상태관리
  let searchValue = useSelector(state => {
    return state.search.data;
  });

  useEffect(() => {
    let copySearchValue = [...searchValue];
    copySearchValue = copySearchValue.sort(function (a, b) {
      return (
        a.startTime.substr(0, 10).replaceAll('-', '') -
        b.startTime.substr(0, 10).replaceAll('-', '')
      );
    });

    let event = copySearchValue?.reduce((obj, event) => {
      obj[new Date(event.startTime).getTime()] =
        obj[new Date(event.startTime).getTime()] || [];
      obj[new Date(event.startTime).getTime()].push(event);
      return obj;
    }, {});

    setSearchFilter(event);
  }, [searchValue]);

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
    <>
      {isModalShown && (
        <EventDetailModal hideModal={hideModal} modalData={modalData} />
      )}
      <div className={styles.container}>
        {searchFilter && (
          <ul>
            {Object.entries(searchFilter).map(function ([time, item], index) {
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
                    {item.map((item, index) => {
                      return (
                        <div
                          key={index}
                          ref={eventItem}
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
                                <span style={{ background: item.color }}></span>
                                <em>종일</em>
                              </div>
                            ) : (
                              <em>
                                {item.startTime.substr(11, 5)} ~{' '}
                                {item.endTime.substr(11, 5)}
                              </em>
                            )}
                          </div>
                          <div className={styles.content}>
                            <p>{item.name}</p>
                            {item.name.length == 0 ? <p>(제목 없음)</p> : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {searchValue && searchValue.length == 0 ? (
          <div className={styles.search_undefined}>
            <em>검색 결과가 없습니다.</em>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Index;
