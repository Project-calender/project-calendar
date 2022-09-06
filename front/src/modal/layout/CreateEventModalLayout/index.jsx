import React from 'react';
import PropTypes from 'prop-types';
import CreateEventModal from '../../component/CreateEventModal';
import ListModal from '../../component/ListModal';
import CustomAlertModal from '../../component/CustomAlertModal';
import MiniCalendarModal from '../../component/MiniCalendarModal';
import TimeListModal from '../../component/TimeListModal';

import {
  CreateEventModalContext,
  EventInfoListModalContext,
  EventCustomAlertModalContext,
  EventDateModalContext,
} from '../../../context/EventModalContext';
import useEventModal from '../../../hooks/useEventModal';
import { useDispatch } from 'react-redux';
import { updateNewEventTime } from '../../../store/newEvent';

const Index = ({ children }) => {
  const createEventModal = useEventModal();
  const eventInfoModal = useEventModal();
  const eventCustomAlertModal = useEventModal();
  const miniCalendarModal = useEventModal();
  const startTimeListModal = useEventModal();
  const endTimeListModal = useEventModal();

  function hideAllSubModal() {
    eventInfoModal.hideModal();
    eventCustomAlertModal.hideModal();
    miniCalendarModal.hideModal();
    startTimeListModal.hideModal();
    endTimeListModal.hideModal();
  }

  function showEventInfoModal(e, data) {
    const { top, left } = e.currentTarget.getBoundingClientRect();
    eventInfoModal.showModal({
      ...data,
      style: { top, left },
    });
    e.stopPropagation();
  }

  const createEventModalContext = {
    ...createEventModal,
  };

  const eventInfoModalContext = {
    ...eventInfoModal,
    showModal: (e, data) => {
      hideAllSubModal();
      showEventInfoModal(e, data);
    },
  };

  const eventDateModalContextData = {
    miniCalendarModal,
    startTimeListModal,
    endTimeListModal,
    hideAllSubModal,
  };

  const dispatch = useDispatch();
  function onClickTimeItem(e, type) {
    const date = new Date(+e.target.dataset.value);
    dispatch(
      updateNewEventTime({
        type,
        minute: date.getMinutes(),
        hour: date.getHours(),
      }),
    );
    if (type === 'startTime') startTimeListModal.hideModal();
    if (type === 'endTime') endTimeListModal.hideModal();
    e.stopPropagation();
  }

  return (
    <CreateEventModalContext.Provider value={createEventModalContext}>
      {createEventModal.isModalShown && (
        <EventInfoListModalContext.Provider value={eventInfoModalContext}>
          <EventCustomAlertModalContext.Provider value={eventCustomAlertModal}>
            <EventDateModalContext.Provider value={eventDateModalContextData}>
              <CreateEventModal>
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

                {miniCalendarModal.isModalShown && (
                  <MiniCalendarModal
                    hideModal={miniCalendarModal.hideModal}
                    modalData={miniCalendarModal.modalData}
                  />
                )}

                {startTimeListModal.isModalShown && (
                  <TimeListModal
                    hideModal={startTimeListModal.hideModal}
                    modalData={startTimeListModal.modalData}
                    onClickItem={e => onClickTimeItem(e, 'startTime')}
                  />
                )}

                {endTimeListModal.isModalShown && (
                  <TimeListModal
                    hideModal={endTimeListModal.hideModal}
                    modalData={endTimeListModal.modalData}
                    onClickItem={e => onClickTimeItem(e, 'endTime')}
                  />
                )}
              </CreateEventModal>
            </EventDateModalContext.Provider>
          </EventCustomAlertModalContext.Provider>
        </EventInfoListModalContext.Provider>
      )}
      {children}
    </CreateEventModalContext.Provider>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};
export default Index;
