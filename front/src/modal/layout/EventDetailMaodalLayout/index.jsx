import React from 'react';
import PropTypes from 'prop-types';
import EventDetailModal from '../../component/EventDetailModal';
import { EventDetailModalContext } from '../../../context/EventModalContext';
import useEventModal from '../../../hooks/useEventModal';

const Index = ({ children }) => {
  const eventDetailModal = useEventModal();

  return (
    <EventDetailModalContext.Provider value={eventDetailModal}>
      {eventDetailModal.isModalShown && <EventDetailModal />}
      {children}
    </EventDetailModalContext.Provider>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};
export default Index;
