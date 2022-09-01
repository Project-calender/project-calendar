import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './style.module.css';
import Proptypes from 'prop-types';
import ListModal from '../../../modal/component/ListModal';
import useEventModal from '../../../hooks/useEventModal';

const Index = ({
  name,
  onChange = () => {},
  itemList,
  selectedItem = itemList[0],
}) => {
  const { hideModal, modalData, showModal, isModalShown } = useEventModal();

  function onClickItem(e) {
    onChange(e);
    hideModal();
    e.stopPropagation();
  }

  return (
    <div
      className={styles.select_container}
      onClick={e => {
        const { top, left } = e.currentTarget.getBoundingClientRect();
        showModal({
          data: itemList,
          name,
          selectedItem,
          style: { top: top - 5, left },
        });
        e.stopPropagation();
      }}
    >
      <h3 className={styles.select_title}>
        {selectedItem}
        <FontAwesomeIcon className={styles.caret_down} icon={faCaretDown} />
      </h3>
      {isModalShown && (
        <ListModal
          onClickItem={onClickItem}
          hideModal={hideModal}
          modalData={modalData}
        />
      )}
    </div>
  );
};

Index.propTypes = {
  name: Proptypes.string,
  onChange: Proptypes.func,
  itemList: Proptypes.array,
  selectedItem: Proptypes.string,
};

export default Index;
