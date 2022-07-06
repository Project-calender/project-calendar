import React from 'react';
import PropTypes from 'prop-types';
import Date from '../Date';

const Index = ({ week }) => {
  return (
    <tr>
      {week.map((date, index) => (
        <Date key={index} date={date} />
      ))}
    </tr>
  );
};

Index.propTypes = {
  week: PropTypes.array,
};

export default Index;
