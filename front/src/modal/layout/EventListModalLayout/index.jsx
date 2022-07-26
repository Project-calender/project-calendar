import React from 'react';
import PropTypes from 'prop-types';
import EventListModal from '../../component/EventListModal';
import { EventListModalContext } from '../../../context/EventModalContext';
import useEventModal from '../../../hooks/useEventModal';

const Index = ({ children }) => {
  const { isModalShown, modalData, setModalData, showModal, hideModal } =
    useEventModal();

  const modalContextData = { setModalData, showModal };
  return (
    <>
      {isModalShown && (
        <EventListModal modalData={modalData} hideModal={hideModal} />
      )}
      <EventListModalContext.Provider value={modalContextData}>
        {children}
      </EventListModalContext.Provider>
    </>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};
export default Index;
