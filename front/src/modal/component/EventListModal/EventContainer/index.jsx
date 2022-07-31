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

  function handleEventDetailMadal(e) {
    // const { top, left } = e.target.getBoundingClientRect();
    // showEventDetailModal({
    //   style: { position: { top: top - 100, left: left - 450 } },
    // });
    showEventDetailModal();
    e.stopPropagation();

    return { offsetTop: -100, offsetLeft: -450 };
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
