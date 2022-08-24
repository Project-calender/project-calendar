import React from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import MyCalendar from './MyCalendar';
import AnotherCalendar from './AnotherCalendar';

const Index = ({
  targetItem,
  calendarData,
  privateCalendar,
  defaultItem,
  calendarSetting,
  defaultName,
  setDefaultName,
  setChangeName,
  changeName,
  item,
}) => {
  return (
    <div className={styles.container}>
      {calendarSetting == 0 ? (
        <MyCalendar
          targetItem={targetItem}
          calendarData={calendarData}
          privateCalendar={privateCalendar}
          defaultItem={defaultItem}
          defaultName={defaultName}
          setDefaultName={setDefaultName}
          changeName={changeName}
          setChangeName={setChangeName}
          item={item}
        ></MyCalendar>
      ) : (
        <AnotherCalendar
          targetItem={targetItem}
          calendarData={calendarData}
          defaultName={defaultName}
          setDefaultName={setDefaultName}
          changeName={changeName}
          setChangeName={setChangeName}
          item={item}
        ></AnotherCalendar>
      )}
    </div>
  );
};

Index.propTypes = {
  targetItem: PropTypes.object,
  calendarData: PropTypes.func,
  privateCalendar: PropTypes.array,
  defaultItem: PropTypes.bool,
  calendarSetting: PropTypes.number,
  defaultName: PropTypes.string,
  setDefaultName: PropTypes.func,
  changeName: PropTypes.string,
  setChangeName: PropTypes.func,
  item: PropTypes.object,
};

export default Index;
