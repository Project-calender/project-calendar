import React from 'react';
import PropTypes from 'prop-types';
import CreateCalendarModal from '../../component/CreateCalendarModal';
import EventColorModal from '../../component/EventColorModal';

import {
  CreateCalendarModalContext,
  EventColorModalContext,
} from '../../../context/EventModalContext';
import useEventModal from '../../../hooks/useEventModal';

const Index = ({ children }) => {
  const createCalendarModal = useEventModal();
  const eventColorModal = useEventModal();

  function hideCreateCalendarModal() {
    createCalendarModal.hideModal();
    eventColorModal.hideModal();
  }

  function showCreateCalendarModal(e) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    createCalendarModal.showModal({ style: { top, left: left + 40 } });
    e.stopPropagation();
  }

  function showEventColorModal(e, colorData) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    eventColorModal.showModal(data => ({
      ...data,
      ...colorData,
      style: { top, left: left, width: 80 },
    }));
    e.stopPropagation();
  }

  const createCalendarModalContext = {
    ...createCalendarModal,
    showModal: showCreateCalendarModal,
    hideModal: hideCreateCalendarModal,
  };

  const eventColorModalContext = {
    ...eventColorModal,
    showModal: showEventColorModal,
  };

  return (
    <CreateCalendarModalContext.Provider value={createCalendarModalContext}>
      {createCalendarModal.isModalShown && (
        <EventColorModalContext.Provider value={eventColorModalContext}>
          <CreateCalendarModal>
            {eventColorModal.isModalShown && <EventColorModal />}
          </CreateCalendarModal>
        </EventColorModalContext.Provider>
      )}
      {children}
    </CreateCalendarModalContext.Provider>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};
export default Index;
