import React from 'react';
import PropTypes from 'prop-types';
import { EventDetailModalContext } from '../../../../context/EventModalContext';
import EventDetailModal from '../../EventDetailModal';
import useEventModal from '../../../../hooks/useEventModal';

const Index = ({ children }) => {
  const { isModalShown, modalData, showModal, hideModal } = useEventModal();
  return (
    <>
      {isModalShown && (
        <EventDetailModal modalData={modalData} hideModal={hideModal} />
      )}
      <EventDetailModalContext.Provider value={showModal}>
        {children}
      </EventDetailModalContext.Provider>
    </>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};
export default Index;
