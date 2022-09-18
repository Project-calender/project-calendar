import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
//import ChangeName from '../MyCalendar/ChangeName';
import Subscribe from './Subscribe';

const Index = ({
  targetItem,
  calendarData,
  //defaultName,
  //setDefaultName,
  //changeName,
  //setChangeName,
}) => {
  return (
    <article className={styles.content}>
      {/*
        <ChangeName
        targetItem={targetItem}
        calendarData={calendarData}
        defaultName={defaultName}
        setDefaultName={setDefaultName}
        changeName={changeName}
        setChangeName={setChangeName}
      ></ChangeName>
       */}

      <Subscribe
        targetItem={targetItem}
        calendarData={calendarData}
      ></Subscribe>
    </article>
  );
};

Index.propTypes = {
  targetItem: PropTypes.object,
  calendarData: PropTypes.func,
  defaultName: PropTypes.string,
  setDefaultName: PropTypes.func,
  changeName: PropTypes.string,
  setChangeName: PropTypes.func,
};

export default Index;
