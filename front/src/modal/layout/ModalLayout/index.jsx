import React from 'react';
import PropTypes from 'prop-types';
import useEventModal from '../../../hooks/useEventModal';
import { ModalContext } from '../../../context/EventModalContext';

const Index = ({ Modal, children }) => {
  const modal = useEventModal();
  return (
    <ModalContext.Provider value={modal}>
      {modal.isModalShown && <Modal />}
      {children}
    </ModalContext.Provider>
  );
};

Index.propTypes = {
  Modal: PropTypes.func,
  children: PropTypes.node,
};

export default Index;
