import React from 'react';
import PropTypes from 'prop-types';
import Week from './Week';

const Index = ({ month }) => {
  if (countWeek(month) === 5) month.pop();

  return (
    <>
      {month.map((week, index) => (
        <Week key={index} week={week} month={month} />
      ))}
    </>
  );
};

function countWeek(month) {
  return month[2][0].month !== month[month.length - 1][0].month ? 5 : 6;
}

Index.propTypes = {
  month: PropTypes.array,
};

export default Index;
