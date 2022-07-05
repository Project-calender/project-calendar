import React from 'react';
import { WEEK_DAYS } from '../../../../utils/moment';

const Index = () => {
  return (
    <tr>
      {WEEK_DAYS.map(item => {
        return <th key={item}>{item}</th>;
      })}
    </tr>
  );
};

export default Index;
