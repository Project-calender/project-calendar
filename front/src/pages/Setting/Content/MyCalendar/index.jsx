import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import ChangeName from './ChangeName';
import Authority from './Authority';
import CalendarDelete from './CalendarDelete';

const Index = ({
  targetItem,
  calendarData,
  privateCalendar,
  defaultItem,
  defaultName,
  setDefaultName,
  changeName,
  setChangeName,
  item,
}) => {
  let setAuthority = useRef();
  return (
    <article className={styles.content} ref={setAuthority}>
      <ChangeName
        targetItem={targetItem}
        defaultName={defaultName}
        setDefaultName={setDefaultName}
        changeName={changeName}
        setChangeName={setChangeName}
        item={item}
        calendarData={calendarData}
      ></ChangeName>
      {defaultItem == true ? (
        <Authority
          targetItem={targetItem}
          calendarData={calendarData}
          privateCalendar={privateCalendar}
          setDefaultName={setDefaultName}
          setAuthority={setAuthority}
        ></Authority>
      ) : null}
      {defaultItem == true ? (
        <CalendarDelete
          targetItem={targetItem}
          calendarData={calendarData}
        ></CalendarDelete>
      ) : null}
    </article>
  );
};
Index.propTypes = {
  targetItem: PropTypes.object,
  calendarData: PropTypes.func,
  privateCalendar: PropTypes.array,
  defaultItem: PropTypes.bool,
  defaultName: PropTypes.string,
  setDefaultName: PropTypes.func,
  changeName: PropTypes.string,
  setChangeName: PropTypes.func,
  item: PropTypes.object,
};

export default Index;
