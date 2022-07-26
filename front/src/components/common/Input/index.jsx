import React from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';

const Index = ({ type, placeholder, inputClassName, className }) => {
  const [isInputFocus, setInputFocus] = useState(false);
  return (
    <div className={`${styles.input_container} ${className}`}>
      <input
        type={type}
        placeholder={placeholder}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
        className={inputClassName}
      />
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
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default Index;
