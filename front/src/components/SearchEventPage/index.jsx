import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';
import { isCheckedCalander } from '../../store/user';
import axios from '../../utils/token';
import { EVENT_URL } from '../../constants/api';
import SearchItem from './SearchItem';
import EventDetailModal from '../../modal/component/EventDetailModal';
import useEventModal from '../../hooks/useEventModal';
import { deleteEvent, getEventDetail } from '../../store/thunk/event';
import Moment from '../../utils/moment';

const Index = () => {
  let [searchValue, setSearchValue] = useState();
  let [searchFilter, setSearchFilter] = useState();
  let { isModalShown, hideModal, modalData, showModal, setModalData } =
    useEventModal();

  //redux 검색 정보 상태관리
  let searchText = useSelector(state => {
    return state.search.searchText;
  });

  useEffect(() => {
    onSearch();
  }, [searchText]);

  useEffect(() => {
    onFilter();
  }, [searchValue]);

  const dispatch = useDispatch();
  async function onDeleteEvent(event) {
    await dispatch(deleteEvent(event));
    setSearchValue(events =>
      events.filter(
        target =>
          target.CalendarId !== event.CalendarId || target.id !== event.id,
      ),
    );
    return event.id;
  }

  //검색 정보 불러오기
  async function onSearch() {
    try {
      let res = await axios.post(`${EVENT_URL.SEARCH_EVENT}`, {
        searchWord: searchText,
      });
      setSearchValue(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  //검색 값 필터
  function onFilter() {
    let copySearchValue = searchValue && [...searchValue];
    let newSearchValue =
      copySearchValue &&
      copySearchValue
        .sort(function (a, b) {
          return (
            a.startTime.substr(0, 10).replaceAll('-', '') -
            b.startTime.substr(0, 10).replaceAll('-', '')
          );
        })
        .filter(isCheckedCalander);

    let event = newSearchValue?.reduce((obj, event) => {
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

    setSearchFilter(event);
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
                    <div className={styles.wrap}>
                      <SearchItem
                        item={item}
                        setSearchValue={setSearchValue}
                        clickEventBar={clickEventBar}
                      ></SearchItem>
                    </div>
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
