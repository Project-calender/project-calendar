import React from 'react';
import PropTypes from 'prop-types';
import useEventModal from '../../../hooks/useEventModal';
import MiniCalendarModal from '../../component/MiniCalendarModal';
import TimeListModal from '../../component/TimeListModal';
import { useDispatch } from 'react-redux';
import { updateNewEventTime } from '../../../store/newEvent';
import { eventDateModalContext } from '../../../context/EventModalContext';

const Index = ({ children }) => {
  const miniCalendarModal = useEventModal();
  const startTimeListModal = useEventModal();
  const endTimeListModal = useEventModal();

  const eventDateModalContextData = {
    miniCalendarModal,
    startTimeListModal,
    endTimeListModal,
  };

  const dispatch = useDispatch();
  function onClickTimeItem(e, type) {
    const date = new Date(+e.target.dataset.value);
    dispatch(
      updateNewEventTime({
        type: 'startTime',
        minute: date.getMinutes(),
        hour: date.getHours(),
      }),
    );
    if (type === 'startTime') startTimeListModal.hideModal();
    if (type === 'endTime') endTimeListModal.hideModal();
    e.stopPropagation();
  }

  return (
    <>
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
      <eventDateModalContext.Provider value={eventDateModalContextData}>
        {children}
      </eventDateModalContext.Provider>
    </>
  );
};

Index.propTypes = {
  Modal: PropTypes.func,
  Context: PropTypes.object,
  children: PropTypes.node,
};

export default Index;
