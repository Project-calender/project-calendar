import React from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.css';
import EventDetailModal from '../../modal/component/EventDetailModal';
import useEventModal from '../../hooks/useEventModal';
import axios from '../../utils/token';
import { EVENT_URL } from '../../constants/api';

const Index = () => {
  let { isModalShown, showModal, hideModal, modalData } = useEventModal();

  //redux 검색 정보 상태관리
  let searchValue = useSelector(state => {
    return state.search.data;
  });
  let copySearchValue = [...searchValue];

  //날짜 순으로 정렬
  searchValue = copySearchValue.sort(function (a, b) {
    return (
      a.startTime.substr(5, 5).replace('-', '') -
      b.startTime.substr(5, 5).replace('-', '')
    );
  });

  //이벤트 팝업창 컨트롤
  async function clickEventBar(e, event) {
    const { top, right } = e.currentTarget.getBoundingClientRect();
    const { data } = await axios.post(EVENT_URL.GET_EVENT_DETAIL, {
      eventId: event.PrivateCalendarId ? event.groupEventId : event.id,
    });
    const { EventMembers, EventHost } = data;
    showModal(data => ({
      ...data,
      event: { ...event, EventMembers, EventHost },
      style: {
        position: {
          top: top,
          left: right,
        },
      },
    }));
    e.stopPropagation();
  }

  return (
    <>
      {isModalShown && (
        <EventDetailModal hideModal={hideModal} modalData={modalData} />
      )}
      <div className={styles.container}>
        <ul>
          {searchValue &&
            searchValue.map(function (item) {
              return (
                <li key={item.id}>
                  <div className={styles.time}>
                    <div className={styles.day}>
                      <em>{item.startTime.substr(8, 2)}</em>
                    </div>
                    <div className={styles.year}>
                      <p>
                        {item.startTime.substr(0, 4)}년
                        {item.startTime.substr(5, 2)}월
                      </p>
                    </div>
                  </div>
                  <div
                    className={styles.event_wrap}
                    onClick={e => {
                      clickEventBar(e, item);
                    }}
                  >
                    <div className={styles.all_day}>
                      {item.allDay == false ||
                      item.endTime.substr(5, 5).replace('-', '') -
                        item.startTime.substr(5, 5).replace('-', '') >
                        1 ? (
                        <em>종일</em>
                      ) : (
                        <em>
                          {item.startTime.substr(11, 5)} ~{' '}
                          {item.endTime.substr(11, 5)}
                        </em>
                      )}
                    </div>
                    <div className={styles.content}>
                      <p>{item.name}</p>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default Index;
