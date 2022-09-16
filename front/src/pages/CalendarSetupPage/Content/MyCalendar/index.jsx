import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './style.module.css';
import ChangeName from './ChangeName';
import Authority from './Authority';
import CalendarDelete from './CalendarDelete';

const Index = ({
  targetItem,
  setTargetItem,
  calendarData,
  privateCalendar,
  defaultItem,
  defaultName,
  setDefaultName,
  changeName,
  setChangeName,
  setDefaultItem,
  setPrivateActive,
}) => {
  let setAuthority = useRef();
  return (
    <article className={styles.content} ref={setAuthority}>
      <ChangeName
        targetItem={targetItem}
        setTargetItem={setTargetItem}
        privateCalendar={privateCalendar}
        defaultName={defaultName}
        setDefaultName={setDefaultName}
        changeName={changeName}
        setChangeName={setChangeName}
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
          setTargetItem={setTargetItem}
          privateCalendar={privateCalendar}
          calendarData={calendarData}
          setDefaultItem={setDefaultItem}
          setPrivateActive={setPrivateActive}
          setChangeName={setChangeName}
        ></CalendarDelete>
      ) : null}
    </article>
  );
};
Index.propTypes = {
  targetItem: PropTypes.object,
  setTargetItem: PropTypes.func,
  calendarData: PropTypes.func,
  privateCalendar: PropTypes.array,
  defaultItem: PropTypes.bool,
  defaultName: PropTypes.string,
  setDefaultName: PropTypes.func,
  changeName: PropTypes.string,
  setChangeName: PropTypes.func,
  setDefaultItem: PropTypes.func,
  setPrivateActive: PropTypes.func,
};

export default Index;
