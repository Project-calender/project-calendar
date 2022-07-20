import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { eventSelector } from '../../../../store/selectors/events';
import Moment from '../../../../utils/moment';
import EventBar from '../../EventBar';

const Index = ({ event, date }) => {
  const { startTime, endTime } = useSelector(state =>
    eventSelector(state, event.id),
  );

  return (
    <EventBar
      eventBar={event}
      left={new Moment(new Date(startTime)).resetTime().time !== date.time}
      right={new Moment(new Date(endTime)).resetTime().time !== date.time}
      outerRight={true}
    />
  );
};

Index.propTypes = {
  event: PropTypes.object,
  date: PropTypes.object,
};

export default Index;
