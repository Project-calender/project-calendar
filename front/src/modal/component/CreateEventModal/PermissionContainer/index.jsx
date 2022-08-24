import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

import {
  faCaretDown,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { EVENT } from '../../../../store/events';
import { useSelector } from 'react-redux';
import { newEventSelector } from '../../../../store/selectors/newEvent';

const Index = ({ showListModal }) => {
  const newEvent = useSelector(newEventSelector);

  return (
    <div className={styles.permission_container}>
      <h3
        onClick={e =>
          showListModal(e, {
            data: EVENT.permission,
            name: 'permission',
            selectedItem: EVENT.permission[newEvent.permission],
          })
        }
      >
        {EVENT.permission[newEvent.permission]}
        <FontAwesomeIcon className={styles.caret_down} icon={faCaretDown} />
      </h3>
      <FontAwesomeIcon icon={faCircleQuestion} />
    </div>
  );
};

Index.propTypes = {
  showListModal: PropTypes.func,
};

export default Index;
