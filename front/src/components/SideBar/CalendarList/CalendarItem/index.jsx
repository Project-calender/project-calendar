import React from 'react';
import styles from './style.module.css';

import PropTypes from 'prop-types';
import Tooltip from '../../../common/Tooltip';
import CheckBox from '../../../common/CheckBox';
import OptionButtons from '../OptionButtons';

import { checkedCalendarSelector } from '../../../../store/selectors/user';
import { useDispatch, useSelector } from 'react-redux';
import { updateCheckedCalendar } from '../../../../store/thunk/user';

const Index = ({ calendar }) => {
  const checkedCalendar = useSelector(state =>
    checkedCalendarSelector(state, calendar),
  );
  const checked = checkedCalendar.includes(calendar?.id);

  const dispatch = useDispatch();
  function handleCheckBox(e) {
    console.log(e.target.checked);
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
        onClick={handleCheckBox}
        defaultChecked={checked}
        color={calendar.color}
      >
        <Tooltip key={calendar.id} title={calendar.name} top={18}>
          <p>{calendar.name}</p>
        </Tooltip>
      </CheckBox>
      <OptionButtons calendar={calendar} />
    </div>
  );
};

Index.propTypes = {
  calendar: PropTypes.object,
};

export default Index;
