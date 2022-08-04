import React from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../../components/common/Modal';
import TextField from '../../../components/common/TextField';
import { useSelector } from 'react-redux';
import { userEmailSelector } from '../../../store/selectors/user';

const Index = ({ hideModal, modalData }) => {
  const { style } = modalData || {};
  const userEmail = useSelector(userEmailSelector);
  return (
    <Modal
      hideModal={hideModal}
      isBackground
      style={{
        ...style,
        boxShadow: '4px 4px 15px 8px rgb(0, 0, 0, 0.3)',
      }}
    >
      <div className={styles.modal_container}>
        <h1>새 캘린더 만들기</h1>
        <TextField label={'캘린더 이름'} autoFocus />
        <div className={styles.calendar_owner}>
          <em>소유자</em>
          <p>{userEmail}</p>
        </div>
        <button>캘린더 만들기</button>
      </div>
    </Modal>
  );
};

Index.propTypes = {
  hideModal: PropTypes.func,
  modalData: PropTypes.object,
};

export default Index;
