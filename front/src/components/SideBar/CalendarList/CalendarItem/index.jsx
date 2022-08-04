import React from 'react';
import styles from './style.module.css';

import PropTypes from 'prop-types';
import Tooltip from '../../../common/Tooltip';
import { checkedCalendarSelector } from '../../../../store/selectors/user';
import { useDispatch, useSelector } from 'react-redux';
import OptionButtons from '../OptionButtons';
import { checkCalendar } from '../../../../store/user';
import CheckBox from '../../../common/CheckBox';
import { updateEventBar } from '../../../../store/events';

const Index = ({ calendar }) => {
  const checked = useSelector(state =>
    checkedCalendarSelector(state, calendar),
  );

  const dispatch = useDispatch();
  function handleCheckBox(e) {
    dispatch(checkCalendar({ id: calendar.id, checked: e.target.checked }));
    dispatch(updateEventBar());
  }

  return (
    <div className={styles.calendar_item}>
      <CheckBox
        onChange={handleCheckBox}
        defaultChecked={checked}
        color={calendar.color}
      >
        <Tooltip key={calendar.id} title={calendar.name} top={18}>
          <p>{calendar.name}</p>
        </Tooltip>
      </CheckBox>
      <OptionButtons calendarType={calendar.type} />
    </div>
  );
};

Index.propTypes = {
  calendar: PropTypes.object,
};

export default Index;
