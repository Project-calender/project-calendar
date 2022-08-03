import React from 'react';
import Moment from '../../../utils/moment';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ event, color, clickEventBar }) => {
  return (
    <div className={styles.time_event} onClick={clickEventBar}>
      <div
        className={styles.time_event_calendar}
        style={{ background: color }}
      />
      <div className={styles.time_event_title}>
        <em>
          {new Moment(event.startTime).getTimeType()}{' '}
          {new Moment(event.startTime).getSimpleTime()}
        </em>
        <em> {event?.name || '(제목 없음)'}</em>
      </div>
    </div>
  );
};

Index.propTypes = {
  event: PropTypes.object,
  color: PropTypes.string,
  clickEventBar: PropTypes.func,
};

export default Index;
