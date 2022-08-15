import React from 'react';
import PropTypes from 'prop-types';
import useEventModal from '../../../hooks/useEventModal';
import { ModalContext } from '../../../context/EventModalContext';

const Index = ({ Modal, Context = ModalContext, children }) => {
  const modal = useEventModal();
  return (
    <Context.Provider value={modal}>
      {modal.isModalShown && (
        <Modal hideModal={modal.hideModal} modalData={modal.modalData} />
      )}
      {children}
    </Context.Provider>
  );
};

Index.propTypes = {
  Modal: PropTypes.func,
  Context: PropTypes.object,
  children: PropTypes.node,
};

export default Index;
