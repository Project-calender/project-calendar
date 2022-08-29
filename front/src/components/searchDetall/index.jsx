import React from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.css';
import EventDetailModal from '../../modal/component/EventDetailModal';
import useEventModal from '../../hooks/useEventModal';
import { EVENT } from '../../store/events';
import { getEventDetail } from '../../store/thunk/event';

const Index = () => {
  let { isModalShown, showModal, hideModal, modalData, setModalData } =
    useEventModal();

  //redux 검색 정보 상태관리
  let searchValue = useSelector(state => {
    return state.search.data;
  });
  let copySearchValue = [...searchValue];

  //날짜 순으로 정렬
  searchValue = copySearchValue.sort(function (a, b) {
    return (
      a.startTime.substr(0, 10).replaceAll('-', '') -
      b.startTime.substr(0, 10).replaceAll('-', '')
    );
  });

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

  return (
    <>
      {isModalShown && (
        <EventDetailModal hideModal={hideModal} modalData={modalData} />
      )}
      <div className={styles.container}>
        <ul>
          {searchValue &&
            searchValue.map(function (item, index) {
              return (
                <li key={index}>
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
                      {item.allDay == EVENT.allDay.true ||
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
