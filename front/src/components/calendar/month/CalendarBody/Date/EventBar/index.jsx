import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import styles from './style.module.css';

const Index = ({ eventBar }) => {
  const eventBarDiv = useRef();

  useEffect(() => {
    eventBarDiv.current.style.background = eventBar.color;
  }, [eventBarDiv.current]);

  if (!eventBar) return;
  return (
    <div
      className={styles.event_bar}
      data-scale={eventBar?.scale || 1}
      ref={eventBarDiv}
    >
      <em> {eventBar.name || '(제목 없음)'} </em>
    </div>
  );
};

Index.propTypes = {
  eventBar: PropTypes.object,
};

export default Index;
