import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Moment from '../../../../utils/moment';
import EventBar from '../../../../components/calendar/EventBar';
import { EventDetailModalContext } from '../../../../context/EventModalContext';

const Index = ({ event, calendar, date }) => {
  const { startTime, endTime } = event;
  const { showModal: showEventDetailModal } = useContext(
    EventDetailModalContext,
  );

  function handleEventDetailMadal(e) {
    showEventDetailModal();
    const { left } = e.target.getBoundingClientRect();
    e.stopPropagation();
    return { offsetTop: -100, offsetLeft: left > 500 ? -450 : 220 };
  }

  return (
    <EventBar
      eventBar={{ scale: 1 }}
      event={event}
      calendar={calendar}
      left={new Moment(new Date(startTime)).resetTime().time !== date.time}
      right={new Moment(new Date(endTime)).resetTime().time !== date.time}
      handleEventDetailMadal={handleEventDetailMadal}
    />
  );
};

Index.propTypes = {
  event: PropTypes.object,
  calendar: PropTypes.object,
  date: PropTypes.object,
};

export default Index;
