import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import {
  EventDetailModalContext,
  SimpleEventOptionModalContext,
} from '../../../../../../../context/EventModalContext';
import { calendarByEventIdSelector } from '../../../../../../../store/selectors/calendars';
import EventBar from '../../../../../EventBar';
import Moment from '../../../../../../../utils/moment';

const Index = ({ dates, eventBar, event }) => {
  const { showModal: showEventDetailModal, hideModal: hideEventDetailModal } =
    useContext(EventDetailModalContext);
  const {
    showModal: showSimpleEventOptionModal,
    hideModal: hideSimpleEventOptionModal,
  } = useContext(SimpleEventOptionModalContext);

  const calendar = useSelector(state =>
    calendarByEventIdSelector(state, event?.CalendarId),
  );

  function handleEventDetailMadal(e) {
    showEventDetailModal();
    hideSimpleEventOptionModal();
    e.stopPropagation();

    return { offsetTop: 25 };
  }

  function handleSimpleEventOptionModal(e, event) {
    const { pageX, pageY } = e;
    showSimpleEventOptionModal({ style: { top: pageY, left: pageX }, event });
    hideEventDetailModal();
    e.preventDefault();
  }

  return (
    <EventBar
      left={
        event && new Moment(event.startTime).resetTime().time < dates[0].time
      }
      right={
        event &&
        new Moment(event.endTime).resetTime().time >
          dates[dates.length - 1].time
      }
      event={event}
      calendar={calendar}
      eventBar={eventBar}
      handleEventDetailMadal={handleEventDetailMadal}
      onContextMenu={
        calendar?.authority >= 2 ? handleSimpleEventOptionModal : null
      }
    />
  );
};

Index.propTypes = {
  dates: PropTypes.array,
  eventBar: PropTypes.object,
  event: PropTypes.object,
};

export default Index;
