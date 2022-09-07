import React, { useRef } from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { useImperativeHandle } from 'react';

const Index = React.forwardRef(
  (
    {
      type,
      defaultValue = null,
      value = null,
      autoFocus = false,
      placeholder,
      onChange = () => {},
      onClick = () => {},
      onBlur = () => {},
      onFocus = () => {},
      onKeyDown = () => {},
      className = '',
    },
    ref,
  ) => {
    const [isInputFocus, setInputFocus] = useState(false);

    function handleBlurEvent(e) {
      onBlur(e);
      setInputFocus(false);
    }

    const inputRef = useRef();
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current.focus(),
    }));

    return (
      <div
        className={`${styles.input_container} ${className}`}
        name="input"
        onClick={onClick}
      >
        <input
          ref={inputRef}
          type={type}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onFocus={e => {
            setInputFocus(true);
            onFocus(e);
          }}
          onBlur={handleBlurEvent}
          onKeyDown={onKeyDown}
          {...(defaultValue !== null ? { defaultValue } : { onChange })}
          {...(value !== null && { value })}
        />
        <hr className={`${styles.input_line} ${styles.line_active}`} />
        <hr
          className={`${styles.input_line} ${
            isInputFocus ? styles.line_active : styles.line_hide
          }`}
        />
      </div>
    );
  },
);
Index.displayName = 'Input';
Index.propTypes = {
  type: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  className: PropTypes.string,
};

export default Index;
