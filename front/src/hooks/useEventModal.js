import { useCallback, useState } from 'react';

export default function useEventModal(initalState = false) {
  const [isModalShown, toggleModal] = useState(initalState);
  const [modalData, setModalData] = useState({});

  const showModal = useCallback(data => {
    if (data) setModalData(data);
    toggleModal(true);
  }, []);

  const hideModal = useCallback((reset = true) => {
    if (reset) setModalData({});
    toggleModal(false);
  }, []);

  return { isModalShown, modalData, showModal, hideModal, setModalData };
}
