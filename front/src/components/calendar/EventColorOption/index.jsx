import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { EventColorModalContext } from '../../../context/EventModalContext';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ colors, color }) => {
  const { showModal: showEventColorModal } = useContext(EventColorModalContext);

  return (
    <div
      className={styles.calendar_info}
      onClick={e => showEventColorModal(e, colors)}
    >
      <div
        className={styles.calendar_info_colors}
        style={{ background: color }}
      />
      <FontAwesomeIcon className={styles.caret_down} icon={faCaretDown} />
    </div>
  );
};

Index.propTypes = {
  colors: PropTypes.object,
  color: PropTypes.string,
};

export default Index;
