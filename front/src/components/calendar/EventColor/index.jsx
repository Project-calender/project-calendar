import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Tooltip from '../../common/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Index = ({ colors, onClickColor, selectedColor = '' }) => {
  return (
    <>
      {[...Object.entries(colors)].map(([name, color]) => (
        <Tooltip title={name} key={color}>
          <div
            className={styles.color_list_item}
            style={{ background: color }}
            onClick={e => onClickColor(e, color)}
          >
            {selectedColor === color && (
              <FontAwesomeIcon icon={faCheck} className={styles.icon_check} />
            )}
          </div>
        </Tooltip>
      ))}
    </>
  );
};
Index.propTypes = {
  colors: PropTypes.object,
  onClickColor: PropTypes.func,
  selectedColor: PropTypes.string,
};

export default Index;
