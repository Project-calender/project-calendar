import React from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ autoFocus = false, label, onBlur = () => {} }) => {
  const [isInputFocus, setInputFocus] = useState(false);
  const [inputValue, setInputValue] = useState();

  function handleBlurEvent(e) {
    onBlur(e);
    setInputFocus(false);
  }

  return (
    <div className={styles.input_container}>
      <label
        className={`${inputValue ? styles.input_label_up : ''} ${
          isInputFocus ? styles.input_label_active : ''
        }`}
      >
        {label}
      </label>
      <input
        type="text"
        autoFocus={autoFocus}
        onFocus={() => setInputFocus(true)}
        onBlur={handleBlurEvent}
        onChange={e => {
          setInputValue(e.target.value);
        }}
      />
      <hr className={`${styles.input_line} ${styles.line_active}`} />
      <hr
        name="active_line"
        className={`${styles.input_line} ${
          isInputFocus ? styles.line_active : styles.line_hide
        }`}
      />
    </div>
  );
};

Index.propTypes = {
  type: PropTypes.string,
  autoFocus: PropTypes.bool,
  label: PropTypes.string,
  onBlur: PropTypes.func,
};

export default Index;
