import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { eventSelector } from '../../../../store/selectors/events';
import Moment from '../../../../utils/moment';
import EventBar from '../../../calendar/EventBar';
import { EventDetailModalContext } from '../../../../context/EventModalContext';

const Index = ({ event, date }) => {
  const { startTime, endTime } = useSelector(state =>
    eventSelector(state, event.id),
  );
  const showEventDetailModal = useContext(EventDetailModalContext);

  function handleEventDetailMadal(e, event) {
    const { top, left } = e.target.getBoundingClientRect();
    showEventDetailModal({
      style: {
        top: window.innerHeight < top + 400 ? null : top - 100,
        bottom: window.innerHeight < top + 400 ? 25 : null,
        left: left - 460,
      },
      event,
    });
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
