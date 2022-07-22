import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { triggerDOM } from '../../../../../../modal/EventListModal';

const Index = ({ events, clickReadMore }) => {
  if (!events.length) return;

  return (
    <div className={styles.title}>
      <em data-modal={triggerDOM} onClick={clickReadMore}>
        {events.length}개 더보기
      </em>
    </div>
  );
};
Index.propTypes = {
  events: PropTypes.array,
  clickReadMore: PropTypes.func,
};

export default Index;
