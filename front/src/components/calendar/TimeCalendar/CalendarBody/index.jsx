import React from 'react';
import PropTypes from 'prop-types';

const Index = ({ dates }) => {
  console.log(dates);

  return <tbody></tbody>;
};
Index.propTypes = {
  dates: PropTypes.array,
};

export default Index;
