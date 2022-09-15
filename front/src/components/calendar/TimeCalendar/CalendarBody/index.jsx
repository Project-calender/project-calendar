import React from 'react';
import PropTypes from 'prop-types';

const Index = ({ dates }) => {
  console.log(dates);

  return (
    <>
      {dates.map(date => (
        <td key={date.time}>
          {[...Array(24)].map((_, i) => (
            <div key={i} />
          ))}
        </td>
      ))}
    </>
  );
};
Index.propTypes = {
  dates: PropTypes.array,
};

export default Index;
