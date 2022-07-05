import React from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const Index = ({ closeSideBar }) => {
  console.log(closeSideBar());
  return (
    <button className={styles.event_btn}>
      <img
        src={`${process.env.PUBLIC_URL}/img/side_bar_plus.png`}
        className={styles.event_img_plus}
        alt="addEventIcon"
      />
      <em className={closeSideBar()}>만들기</em>
      <FontAwesomeIcon
        icon={faCaretDown}
        className={`${styles.event_icon_caret} ${closeSideBar()}`}
      />
    </button>
  );
};

Index.propTypes = {
  closeSideBar: PropTypes.func,
};
export default Index;
