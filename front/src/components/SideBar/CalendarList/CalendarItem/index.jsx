import React from 'react';
import styles from './style.module.css';

import PropTypes from 'prop-types';
import Tooltip from '../../../common/Tooltip';
import { checkedCalendarSelector } from '../../../../store/selectors/user';
import { useDispatch, useSelector } from 'react-redux';
import OptionButtons from '../OptionButtons';
import { checkCalendar } from '../../../../store/user';

const Index = ({ calendar }) => {
  const checked = useSelector(state =>
    checkedCalendarSelector(state, calendar),
  );

  const dispatch = useDispatch();
  function handleCheckBox(e) {
    dispatch(checkCalendar(calendar));
    const { background, border } = checkBoxStyle(e.target.checked);
    e.target.style.background = background;
    e.target.style.border = border;
  }

  return (
    <div className={styles.calendar_item}>
      <label>
        <input
          type="checkbox"
          style={checkBoxStyle(checked)}
          onChange={e => handleCheckBox(e)}
          defaultChecked={checked}
        />
        <Tooltip key={calendar.id} title={calendar.name}>
          <p>{calendar.name}</p>
        </Tooltip>
      </label>
      <OptionButtons calendarType={calendar.type} />
    </div>
  );

  function checkBoxStyle(checked) {
    return {
      background: checked ? calendar.color : 'white',
      border: checked ? 'none' : `2px solid ${calendar.color}`,
    };
  }
};

Index.propTypes = {
  calendar: PropTypes.object,
};

export default Index;
