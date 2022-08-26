import React from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { useImperativeHandle } from 'react';
import { useRef } from 'react';

const Index = React.forwardRef(
  ({ autoFocus = false, label, onBlur = () => {} }, ref) => {
    const [isInputFocus, setInputFocus] = useState(false);
    const [inputValue, setInputValue] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef();
    function handleBlurEvent(e) {
      onBlur(e);
      setInputFocus(false);
    }

    useImperativeHandle(ref, () => ({
      setErrorMessage,
      focus: () => inputRef.current.focus(),
      value: inputValue,
    }));

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
            setErrorMessage('');
          }}
          ref={inputRef}
        />
        <hr
          className={`${styles.input_line} ${styles.line_active}  ${
            errorMessage ? styles.error_line : ''
          }`}
        />
        <hr
          name="active_line"
          className={`${styles.input_line} ${
            isInputFocus ? styles.line_active : styles.line_hide
          }`}
        />
        {errorMessage && (
          <em className={styles.error_message}>{errorMessage}</em>
        )}
      </div>
    );
  },
);

Index.propTypes = {
  type: PropTypes.string,
  autoFocus: PropTypes.bool,
  label: PropTypes.string,
  onBlur: PropTypes.func,
};

Index.displayName = 'TextField';

export default Index;
