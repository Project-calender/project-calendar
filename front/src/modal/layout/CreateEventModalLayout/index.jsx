import React from 'react';
import PropTypes from 'prop-types';
import CreateEventModal from '../../component/CreateEventModal';
import EventColorModal from '../../component/EventColorModal';
import ListModal from '../../component/ListModal';

import {
  CreateEventModalContext,
  EventColorModalContext,
  ListModalContext,
} from '../../../context/EventModalContext';
import useEventModal from '../../../hooks/useEventModal';

const Index = ({ children }) => {
  const createEventModal = useEventModal();
  const eventColorModal = useEventModal();
  const eventInfoModal = useEventModal();

  function hideCreateEventModal() {
    createEventModal.hideModal();
    eventColorModal.hideModal();
    eventInfoModal.hideModal();
  }

  function showEventColorModal(e, colors) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    eventInfoModal.hideModal();
    eventColorModal.showModal({
      colors,
      position: { top, left },
    }),
      e.stopPropagation();
  }

  function showEventInfoModal(e, data) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    eventColorModal.hideModal();
    eventInfoModal.showModal({
      data,
      position: { top, left },
    }),
      e.stopPropagation();
  }
  const eventColorModalContext = {
    ...eventColorModal,
    showModal: showEventColorModal,
  };
  const eventInfoModalContext = {
    ...eventInfoModal,
    showModal: showEventInfoModal,
  };

  return (
    <>
      {createEventModal.isModalShown && (
        <EventColorModalContext.Provider value={eventColorModalContext}>
          <ListModalContext.Provider value={eventInfoModalContext}>
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
              {eventInfoModal.isModalShown && (
                <ListModal
                  hideModal={eventInfoModal.hideModal}
                  modalData={eventInfoModal.modalData}
                />
              )}
            </CreateEventModal>
          </ListModalContext.Provider>
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
