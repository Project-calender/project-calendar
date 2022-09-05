import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Input from '../../common/Input';
import { EVENT } from '../../../store/events';
import Moment from '../../../utils/moment';
import useEventModal from '../../../hooks/useEventModal';
import MiniCalendarModal from '../../../modal/component/MiniCalendarModal';
import TimeListModal from '../../../modal/component/TimeListModal';
const Index = ({ event }) => {
  const [startDate, endDate] = [event.startTime, event.endTime].map(
    time => new Moment(new Date(time)),
  );

  const startMiniCalendarModal = useEventModal();
  const endMiniCalendarModal = useEventModal();
  const startTimeListModal = useEventModal();
  const endTimeListModal = useEventModal();

  return (
    <div className={styles.event_time_container}>
      <Input value={startDate.toDateString()} className={styles.input_fill} />
      {event.allDay === EVENT.allDay.false && (
        <Input
          value={startDate.toTimeString()}
          className={`${styles.input_fill} ${styles.time_input}`}
        />
      )}
      <em>-</em>
      {event.allDay === EVENT.allDay.false && (
        <Input
          value={endDate.toTimeString()}
          className={`${styles.input_fill} ${styles.time_input}`}
        />
      )}
      <Input value={endDate.toDateString()} className={styles.input_fill} />

      {startMiniCalendarModal.isModalShown && <MiniCalendarModal />}
      {endMiniCalendarModal.isModalShown && <MiniCalendarModal />}
      {startTimeListModal.isModalShown && <TimeListModal />}
      {endTimeListModal.isModalShown && <TimeListModal />}
    </div>
  );
};
Index.propTypes = {
  event: PropTypes.object,
};

export default Index;
