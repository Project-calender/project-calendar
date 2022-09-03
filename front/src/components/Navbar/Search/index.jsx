import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import {
  faArrowLeft,
  faSearch,
  faCaretDown,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import Tooltip from './../../common/Tooltip';
import { useState } from 'react';
import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CALENDAR_PATH } from '../../../constants/path';
import { onSearchValue } from '../../../store/search';
import { useDispatch } from 'react-redux';

const Index = ({ setMenuActive }) => {
  let navigate = useNavigate();
  let [searchValue, setSearchValue] = useState(``); //검색어 저장
  let search = useRef(); //검색창
  let url = useLocation(); //url 주소 가지고 오기
  let dispatch = useDispatch();

  //검색창 외부 클릭시 검색창 닫기
  useEffect(() => {
    document.addEventListener('mousedown', clickSearchOutside);

    return () => {
      document.removeEventListener('mousedown', clickSearchOutside);
    };
  });

  //검색창 외부 클릭시 검색창 닫기
  function clickSearchOutside(event) {
    if (!search.current.contains(event.target)) {
      if (url.pathname != `/search`) {
        setMenuActive(1);
      }
    }
  }

  return (
    <div className={styles.search_wrap}>
      <div className={styles.title}>
        <Tooltip title="뒤로가기">
          <div
            className={styles.back_icon}
            onClick={() => {
              setMenuActive(1);
              navigate(CALENDAR_PATH.MAIN);
            }}
          >
            {' '}
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
        </Tooltip>
        <h2>검색</h2>
      </div>
      <div className={styles.search} ref={search}>
        <form>
          <input
            type="text"
            placeholder="검색"
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value);
            }}
          />
          <FontAwesomeIcon icon={faSearch} className={styles.search_icon} />
          {searchValue.length >= 1 ? (
            <div
              className={styles.close}
              onClick={() => {
                setSearchValue(``);
              }}
            >
              <FontAwesomeIcon icon={faTimes} className={styles.close_icon} />
              <em>검색어 지우기</em>
            </div>
          ) : null}
          <div className={styles.search_detail}>
            <FontAwesomeIcon icon={faCaretDown} className={styles.down_icon} />
            <em>검색 옵션</em>
          </div>
          <button
            onClick={e => {
              e.preventDefault();
              dispatch(onSearchValue(searchValue));
              navigate(CALENDAR_PATH.SEARCH);
            }}
          ></button>
        </form>
      </div>
    </div>
  );
};

Index.propTypes = {
  setMenuActive: PropTypes.func,
};

export default Index;
