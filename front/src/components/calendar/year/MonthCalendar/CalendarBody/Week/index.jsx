import React from 'react';
import PropTypes from 'prop-types';
import Date from '../Date';

const Index = ({ week, month }) => {
  return (
    <tr>
      {week.map(date => (
        <Date key={date.time} month={month} date={date} />
      ))}
    </tr>
  );
};

Index.propTypes = {
  week: PropTypes.array,
  month: PropTypes.number,
};

export default Index;
