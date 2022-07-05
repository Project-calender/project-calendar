import React from 'react';
import PropTypes from 'prop-types';

const Index = ({ date }) => {
  return (
    <td>
      <em>{date.date}</em>
    </td>
  );
};

Index.propTypes = {
  date: PropTypes.object,
};

export default Index;
