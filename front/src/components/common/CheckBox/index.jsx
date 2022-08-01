import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({
  children,
  onChange = () => {},
  defaultChecked = true,
  color = '#1a73e8',
}) => {
  function handleCheckBox(e) {
    const { background, border } = checkBoxStyle(e.target.checked);
    e.target.style.background = background;
    e.target.style.border = border;
    onChange(e);
  }

  function checkBoxStyle(checked) {
    return {
      background: checked ? color : 'white',
      border: checked ? 'none' : `2px solid ${color}`,
    };
  }

  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        style={checkBoxStyle(defaultChecked)}
        onChange={handleCheckBox}
        defaultChecked={defaultChecked}
      />
      {children}
    </label>
  );
};

Index.propTypes = {
  children: PropTypes.node,
  onChange: PropTypes.func,
  defaultChecked: PropTypes.bool,
  color: PropTypes.string,
};

export default Index;
