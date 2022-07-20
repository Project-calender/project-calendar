import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { EventDetailModalContext } from '../../../context/EventModalContext';
import { calendarByEventIdSelector } from '../../../store/selectors/calendars';
import { eventSelector } from '../../../store/selectors/events';
import { triggerDOM } from '../EventDetailModal';
import styles from './style.module.css';

const Index = ({
  eventBar,
  left = false,
  right = false,
  outerRight = false,
}) => {
  const event = useSelector(state => eventSelector(state, eventBar.id));
  const calendar = useSelector(state =>
    calendarByEventIdSelector(state, event),
  );
  const showModal = useContext(EventDetailModalContext);

  const eventBarStyle = {
    container: {
      width: `calc(100% * ${eventBar?.scale} + ${eventBar?.scale}px - 5px)`,
    },
    main: {
      background: `linear-gradient(to right, ${calendar?.color} 5px, ${event?.color} 5px)`,
    },
    left: { borderRightColor: calendar?.color },
    right: { borderLeftColor: event?.color },
  };

  return (
    <div className={styles.event_container} style={eventBarStyle.container}>
      {left && <div className={styles.event_left} style={eventBarStyle.left} />}

      {eventBar.scale && (
        <div
          className={styles.event_bar}
          style={eventBarStyle.main}
          data-modal={triggerDOM}
          onClick={() => {
            showModal({ position: {}, event });
          }}
        >
          <em data-modal={triggerDOM}> {event?.name || '(제목 없음)'} </em>
        </div>
      )}

      {right && (
        <div
          className={`${styles.event_right} ${
            outerRight ? styles.event_right_outer : null
          }`}
          style={eventBarStyle.right}
        />
      )}
    </div>
  );
};

Index.propTypes = {
  eventBar: PropTypes.object,
  left: PropTypes.bool,
  right: PropTypes.bool,
  outerRight: PropTypes.bool,
};

export default Index;
