import React from 'react';
import styles from './style.module.css';

import PropTypes from 'prop-types';
import CheckBox from '../../../common/CheckBox';
import OptionButtons from '../OptionButtons';

import { checkedCalendarSelector } from '../../../../store/selectors/user';
import { useDispatch, useSelector } from 'react-redux';
import { updateCheckedCalendar } from '../../../../store/thunk/user';

const Index = ({ calendar }) => {
  const checkedCalendar = useSelector(checkedCalendarSelector);
  const checked = checkedCalendar.includes(calendar?.id);

  const dispatch = useDispatch();
  function handleCheckBox(e) {
    dispatch(
      updateCheckedCalendar({
        checkedList: e.target.checked
          ? checkedCalendar.concat(calendar.id)
          : checkedCalendar.filter(id => id != calendar.id),
      }),
    );
  }

  return (
    <div className={styles.calendar_item}>
      <CheckBox
        onChange={handleCheckBox}
        checked={checked}
        color={calendar.color}
      >
        <p>{calendar.name}</p>
      </CheckBox>
      <OptionButtons calendar={calendar} />
    </div>
  );
};

Index.propTypes = {
  calendar: PropTypes.object,
};

export default Index;
