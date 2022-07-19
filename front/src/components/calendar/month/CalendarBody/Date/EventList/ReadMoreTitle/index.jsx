import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { EventListModalContext } from '../../../../../../../context/EventListModalContext';

const Index = ({ events, restEvents }) => {
  const showModal = useContext(EventListModalContext);
  if (!restEvents.length) return;

  return (
    <div className={styles.title} onClick={() => showModal(events)}>
      <em>{restEvents.length}개 더보기</em>
    </div>
  );
};
Index.propTypes = {
  events: PropTypes.array,
  restEvents: PropTypes.array,
};

export default Index;
