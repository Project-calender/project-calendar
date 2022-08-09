import React from 'react';
import styles from './style.module.css';
import ListModal from '../ListModal';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { setNewEventBars } from '../../../store/events';
import Moment from '../../../utils/moment';
import { createEventBar } from '../../../hooks/useCreateEventBar';
import { selectedDateSelector } from '../../../store/selectors/date';

const Index = ({ hideModal, modalData }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectedDateSelector);
  const today = new Moment(new Date()).resetTime();

  function onClickItem(e) {
    const firstDateOfMonth = new Date(selectedDate.time);
    firstDateOfMonth.setDate(1);

    const newEventTime =
      selectedDate.year === today.year && selectedDate.month === today.month
        ? today.time
        : firstDateOfMonth.getTime();

    const newEventBar = createEventBar({
      standardDateTime: newEventTime,
      endDateTime: newEventTime,
    });
    if (e.target.innerText === '이벤트') {
      dispatch(setNewEventBars(newEventBar));
      hideModal();
    }
  }
  return (
    <div className={styles.modal_root}>
      <ListModal
        hideModal={hideModal}
        modalData={modalData}
        onClickItem={onClickItem}
      />
    </div>
  );
};
Index.propTypes = {
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
};

export default Index;
