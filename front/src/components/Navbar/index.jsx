import React from 'react';
import styles from './style.module.css';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import PropTypes from 'prop-types';

const Index = ({
  activeClass,
  setActiveClass,
  dateActive,
  setDateActive,
  userClassAdd,
  setUserClassAdd,
  userActive,
  setUserActive,
}) => {
  return (
    <div>
      <nav className={styles.nav}>
        <div className={styles.menu_wrap}>
          <LeftMenu></LeftMenu>
          <RightMenu
            activeClass={activeClass}
            setActiveClass={setActiveClass}
            dateActive={dateActive}
            setDateActive={setDateActive}
            userClassAdd={userClassAdd}
            setUserClassAdd={setUserClassAdd}
            userActive={userActive}
            setUserActive={setUserActive}
          ></RightMenu>
        </div>
      </nav>
    </div>
  );
};
Index.propTypes = {
  activeClass: PropTypes.string,
  setActiveClass: PropTypes.func,
  dateActive: PropTypes.bool,
  setDateActive: PropTypes.func,
  userClassAdd: PropTypes.string,
  setUserClassAdd: PropTypes.func,
  userActive: PropTypes.bool,
  setUserActive: PropTypes.func,
};

export default Index;
