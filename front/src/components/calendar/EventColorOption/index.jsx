import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import useEventModal from '../../../hooks/useEventModal';
import EventColorModal from '../../../modal/component/EventColorModal';

const Index = ({ colors, selectedColor, changeColor = () => {} }) => {
  const eventColorModal = useEventModal();

  return (
    <>
      <div
        className={styles.calendar_info}
        onClick={e => {
          const { top, left } = e.currentTarget.getBoundingClientRect();
          eventColorModal.showModal({
            style: { top, left },
          });
          e.stopPropagation();
        }}
      >
        <div
          className={styles.calendar_info_colors}
          style={{ background: selectedColor }}
        />
        <FontAwesomeIcon className={styles.caret_down} icon={faCaretDown} />
      </div>

      {eventColorModal.isModalShown && (
        <EventColorModal
          colors={colors}
          selectedColor={selectedColor}
          onClickColor={changeColor}
          hideModal={eventColorModal.hideModal}
          modalData={eventColorModal.modalData}
        />
      )}
    </>
  );
};

Index.propTypes = {
  colors: PropTypes.object,
  selectedColor: PropTypes.string,
  changeColor: PropTypes.func,
};

export default Index;
