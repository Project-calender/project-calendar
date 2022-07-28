import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Moment from '../../../../utils/moment';
import EventBar from '../../../../components/calendar/EventBar';
import { useSelector } from 'react-redux';
import { eventSelector } from '../../../../store/selectors/events';
import { EventDetailModalContext } from '../../../../context/EventModalContext';

const Index = ({ event, date }) => {
  const { startTime, endTime } = useSelector(state =>
    eventSelector(state, event.id),
  );
  const { showModal: showEventDetailModal } = useContext(
    EventDetailModalContext,
  );

  function handleEventDetailMadal(e, event) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    showEventDetailModal({
      style: { position: { top: top - 100, left: left - 450 } },
      event,
    });
    e.stopPropagation();
  }

  return (
    <EventBar
      eventBar={event}
      left={new Moment(new Date(startTime)).resetTime().time !== date.time}
      right={new Moment(new Date(endTime)).resetTime().time !== date.time}
      outerRight={true}
      handleEventDetailMadal={handleEventDetailMadal}
    />
  );
};

Index.propTypes = {
  event: PropTypes.object,
  date: PropTypes.object,
};

export default Index;
