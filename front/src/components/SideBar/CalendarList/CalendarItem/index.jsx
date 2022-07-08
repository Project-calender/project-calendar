import React from 'react';
import styles from './style.module.css';

import PropTypes from 'prop-types';
import Tooltip from '../../../common/Tooltip';
import { checkCalendarSelector } from '../../../../store/selectors/user';
import { useSelector } from 'react-redux';
import OptionButtons from '../OptionButtons';

const Index = ({ calendar }) => {
  const checked = useSelector(state => checkCalendarSelector(state, calendar));

  return (
    <div className={styles.calendar_item}>
      <label>
        <input
          type="checkbox"
          style={checkBoxStyle(checked)}
          onChange={e => handleCheckBox(e)}
          defaultChecked={checked}
        />
        <Tooltip key={calendar.id} title={calendar.calendarName}>
          <p>{calendar.calendarName}</p>
        </Tooltip>
      </label>
      <OptionButtons calendar={calendar} />
    </div>
  );

  function handleCheckBox(e) {
    const { background, border } = checkBoxStyle(e.target.checked);
    e.target.style.background = background;
    e.target.style.border = border;
  }

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
