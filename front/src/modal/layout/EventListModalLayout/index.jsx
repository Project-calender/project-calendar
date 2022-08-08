import React from 'react';
import PropTypes from 'prop-types';
import EventListModal from '../../component/EventListModal';
import { EventListModalContext } from '../../../context/EventModalContext';
import useEventModal from '../../../hooks/useEventModal';

const Index = ({ children }) => {
  const eventListModal = useEventModal();

  return (
    <EventListModalContext.Provider value={eventListModal}>
      {eventListModal.isModalShown && <EventListModal />}
      {children}
    </EventListModalContext.Provider>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};
export default Index;
