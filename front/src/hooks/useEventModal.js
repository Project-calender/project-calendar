import { useCallback, useState } from 'react';

export default function useEventModal(initalState = false) {
  const [isModalShown, toggleModal] = useState(initalState);
  const [modalData, setModalData] = useState(null);

  const showModal = useCallback(data => {
    if (data) setModalData(data);
    toggleModal(true);
  }, []);

  const hideModal = useCallback(() => {
    setModalData(null);
    toggleModal(false);
  }, []);

  return { isModalShown, modalData, showModal, hideModal, setModalData };
}
