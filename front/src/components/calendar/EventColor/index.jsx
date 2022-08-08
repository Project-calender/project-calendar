import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Tooltip from '../../common/Tooltip';

const Index = ({ colors, onClickColor }) => {
  return (
    <>
      {[...Object.entries(colors)].map(([name, color]) => (
        <Tooltip title={name} key={color}>
          <div
            className={styles.color_list_item}
            style={{ background: color }}
            onClick={e => onClickColor(e, color)}
          />
        </Tooltip>
      ))}
    </>
  );
};
Index.propTypes = {
  colors: PropTypes.object,
  onClickColor: PropTypes.func,
};

export default Index;
