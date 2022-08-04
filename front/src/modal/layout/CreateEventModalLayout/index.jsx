import React from 'react';
import PropTypes from 'prop-types';
import CreateEventModal from '../../component/CreateEventModal';
import EventColorModal from '../../component/EventColorModal';
import {
  CreateEventModalContext,
  EventColorModalContext,
} from '../../../context/EventModalContext';
import useEventModal from '../../../hooks/useEventModal';

const Index = ({ children }) => {
  const createEventModal = useEventModal();
  const eventColorModal = useEventModal();

  function hideCreateEventModal() {
    createEventModal.hideModal();
    eventColorModal.hideModal();
  }

  return (
    <>
      {createEventModal.isModalShown && (
        <EventColorModalContext.Provider value={eventColorModal}>
          <CreateEventModal
            hideModal={hideCreateEventModal}
            style={createEventModal.modalData.style}
          >
            {eventColorModal.isModalShown && (
              <EventColorModal
                hideModal={eventColorModal.hideModal}
                modalData={eventColorModal.modalData}
              />
            )}
          </CreateEventModal>
        </EventColorModalContext.Provider>
      )}
      <CreateEventModalContext.Provider value={createEventModal}>
        {children}
      </CreateEventModalContext.Provider>
    </>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};
export default Index;
