import React from 'react';
import PropTypes from 'prop-types';
import Date from '../Date';

const Index = ({ week, month }) => {
  return (
    <tr>
      {week.map((date, index) => (
        <Date key={index} date={date} month={month} />
      ))}
    </tr>
  );
};

Index.propTypes = {
  week: PropTypes.array,
  month: PropTypes.array,
};

export default Index;
