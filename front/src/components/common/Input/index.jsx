import React from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({
  type,
  defaultValue = null,
  value,
  autoFocus = false,
  placeholder,
  onBlur = () => {},
  onKeyDown = () => {},
  className = '',
}) => {
  const [isInputFocus, setInputFocus] = useState(false);

  function handleBlurEvent(e) {
    onBlur(e);
    setInputFocus(false);
  }

  return (
    <div className={`${styles.input_container} ${className}`}>
      <input
        type={type}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onFocus={() => setInputFocus(true)}
        onBlur={handleBlurEvent}
        onKeyDown={onKeyDown}
        {...(defaultValue !== null ? { defaultValue } : { value })}
      />
      <hr className={`${styles.input_line} ${styles.line_active}`} />
      <hr
        className={`${styles.input_line} ${
          isInputFocus ? styles.line_active : styles.line_hide
        }`}
      />
    </div>
  );
};

Index.propTypes = {
  type: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  className: PropTypes.string,
};

export default Index;
