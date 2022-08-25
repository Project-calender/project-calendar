import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import MyCalendar from './MyCalendar';
import AnotherCalendar from './AnotherCalendar';

const Index = ({
  targetItem,
  setTargetItem,
  calendarData,
  privateCalendar,
  defaultItem,
  calendarSetting,
  defaultName,
  setDefaultName,
  setChangeName,
  changeName,
  setDefaultItem,
  setPrivateActive,

}) => {
  return (
    <div className={styles.container}>
      {calendarSetting == 0 ? (
        <MyCalendar
          targetItem={targetItem}
          setTargetItem={setTargetItem}
          calendarData={calendarData}
          privateCalendar={privateCalendar}
          defaultItem={defaultItem}
          defaultName={defaultName}
          setDefaultName={setDefaultName}
          changeName={changeName}
          setChangeName={setChangeName}
          setDefaultItem={setDefaultItem}
          setPrivateActive={setPrivateActive}
        ></MyCalendar>
      ) : (
        <AnotherCalendar
          targetItem={targetItem}
          calendarData={calendarData}
          defaultName={defaultName}
          setDefaultName={setDefaultName}
          changeName={changeName}
          setChangeName={setChangeName}
        ></AnotherCalendar>
      )}
    </div>
  );
};

Index.propTypes = {
  targetItem: PropTypes.object,
  setTargetItem: PropTypes.func,
  calendarData: PropTypes.func,
  privateCalendar: PropTypes.array,
  defaultItem: PropTypes.bool,
  calendarSetting: PropTypes.number,
  defaultName: PropTypes.string,
  setDefaultName: PropTypes.func,
  changeName: PropTypes.string,
  setChangeName: PropTypes.func,
  setDefaultItem: PropTypes.func,
  setPrivateActive: PropTypes.func,

};

export default Index;
