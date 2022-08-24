import React from 'react';
import PropTypes from 'prop-types';
import CreateEventModal from '../../component/CreateEventModal';
import EventColorModal from '../../component/EventColorModal';
import ListModal from '../../component/ListModal';
import CustomAlertModal from '../../component/CustomAlertModal';

import {
  CreateEventModalContext,
  EventColorModalContext,
  EventInfoListModalContext,
  EventCustomAlertModalContext,
} from '../../../context/EventModalContext';
import useEventModal from '../../../hooks/useEventModal';

const Index = ({ children }) => {
  const createEventModal = useEventModal();
  const eventColorModal = useEventModal();
  const eventInfoModal = useEventModal();
  const eventCustomAlertModal = useEventModal();

  function hideCreateEventModal() {
    createEventModal.hideModal();
    eventColorModal.hideModal();
    eventInfoModal.hideModal();
  }

  function showEventColorModal(e, colorData) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    eventInfoModal.hideModal();
    eventColorModal.showModal({
      ...colorData,
      style: { top, left },
    });
    e.stopPropagation();
  }

  function showEventInfoModal(e, data) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    eventColorModal.hideModal();
    eventInfoModal.showModal({
      ...data,
      style: { top, left },
    });
    e.stopPropagation();
  }

  const createEventModalContext = {
    ...createEventModal,
    hideModal: hideCreateEventModal,
  };
  const eventColorModalContext = {
    ...eventColorModal,
    showModal: showEventColorModal,
  };
  const eventInfoModalContext = {
    ...eventInfoModal,
    showModal: showEventInfoModal,
  };
  return (
    <CreateEventModalContext.Provider value={createEventModalContext}>
      {createEventModal.isModalShown && (
        <EventColorModalContext.Provider value={eventColorModalContext}>
          <EventInfoListModalContext.Provider value={eventInfoModalContext}>
            <EventCustomAlertModalContext.Provider
              value={eventCustomAlertModal}
            >
              <CreateEventModal>
                {eventColorModal.isModalShown && <EventColorModal />}
                {eventInfoModal.isModalShown && (
                  <ListModal
                    hideModal={eventInfoModal.hideModal}
                    modalData={eventInfoModal.modalData}
                  />
                )}
                {eventCustomAlertModal.isModalShown && (
                  <CustomAlertModal
                    hideModal={eventCustomAlertModal.hideModal}
                    modalData={eventCustomAlertModal.modalData}
                  />
                )}
              </CreateEventModal>
            </EventCustomAlertModalContext.Provider>
          </EventInfoListModalContext.Provider>
        </EventColorModalContext.Provider>
      )}
      {children}
    </CreateEventModalContext.Provider>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};
export default Index;
