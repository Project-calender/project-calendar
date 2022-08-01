import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Moment from '../../../../utils/moment';
import EventBar from '../../../../components/calendar/EventBar';
import { EventDetailModalContext } from '../../../../context/EventModalContext';

const Index = ({ event, calendarColor, date }) => {
  const { startTime, endTime } = event;
  const { showModal: showEventDetailModal } = useContext(
    EventDetailModalContext,
  );

  function handleEventDetailMadal(e) {
    showEventDetailModal();
    e.stopPropagation();

    return { offsetTop: -100, offsetLeft: -450 };
  }

  return (
    <EventBar
      eventBarScale={1}
      event={event}
      calendarColor={calendarColor}
      left={new Moment(new Date(startTime)).resetTime().time !== date.time}
      right={new Moment(new Date(endTime)).resetTime().time !== date.time}
      outerRight={true}
      handleEventDetailMadal={handleEventDetailMadal}
    />
  );
};

Index.propTypes = {
  event: PropTypes.object,
  calendarColor: PropTypes.string,
  date: PropTypes.object,
};

export default Index;
