import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { EventColorModalContext } from '../../../context/EventModalContext';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

const Index = ({ colors, color, changedColor = '' }) => {
  const { showModal: showEventColorModal, modalData } = useContext(
    EventColorModalContext,
  );
  console.log(colors);

  useEffect(() => {
    if (modalData?.color && modalData?.color !== color)
      changedColor(modalData.color);
  }, [modalData?.color, color, changedColor]);

  return (
    <div
      className={styles.calendar_info}
      onClick={e => showEventColorModal(e, { colors, selectedColor: color })}
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
  changedColor: PropTypes.func,
};

export default Index;
