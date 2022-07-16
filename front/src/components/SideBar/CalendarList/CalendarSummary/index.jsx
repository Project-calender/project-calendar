import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

const Index = ({ title }) => {
  const [toggle, setToggle] = useState(true);

  return (
    <summary onClick={() => setToggle(toggle => !toggle)}>
      <em>{title}</em>
      <FontAwesomeIcon icon={toggle ? faAngleUp : faAngleDown} />
    </summary>
  );
};

Index.propTypes = {
  title: PropTypes.string,
};

export default Index;
