import React from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({
  type,
  autoFocus = false,
  placeholder,
  inputClassName,
  className,
  onBlur = () => {},
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
        className={inputClassName}
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
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  onBlur: PropTypes.func,
};

export default Index;
