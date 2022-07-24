import React from 'react';
import PropTypes from 'prop-types';
import { CreateEventModalContext } from '../../../../context/EventModalContext';
import CreateEventModal from '../../CreateEventModal';
import useEventModal from '../../../../hooks/useEventModal';

const Index = ({ children }) => {
  const { isModalShown, modalData, setModalData, showModal, hideModal } =
    useEventModal();

  const modalContextData = { isModalShown, setModalData, showModal, hideModal };
  return (
    <>
      {isModalShown && (
        <CreateEventModal modalData={modalData} hideModal={hideModal} />
      )}
      <CreateEventModalContext.Provider value={modalContextData}>
        {children}
      </CreateEventModalContext.Provider>
    </>
  );
};

Index.propTypes = {
  children: PropTypes.node,
};
export default Index;
