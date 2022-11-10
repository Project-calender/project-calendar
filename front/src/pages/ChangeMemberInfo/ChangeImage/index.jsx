import React from 'react';
import axios from '../../../utils/token';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import { faCameraRetro } from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import Axios from 'axios';
import { BASE_URL, USER_URL } from '../../../constants/api';

const Index = ({ userImg, setUserImg }) => {
  //input file로 선택한 이미지를 DB로 보내기
  const onChangeImg = e => {
    const uploadFile = e.target.files[0];
    const formData = new FormData();
    formData.append('image', uploadFile);

    Axios.post(`${BASE_URL}${USER_URL.USER_PROFILE_IMAGE}`, formData)
      .then(res => {
        setUserImg(res.data.src);
        userChangeImage(res.data.src);
      })
      .catch(error => {
        console.log('이미지 업로드실패', error);
      });
  };

  //프로필 이미지 변경 함수
  function userChangeImage(profileImageSrc) {
    axios
      .post(USER_URL.USER_CHANGE_PROFILE_IMAGE, {
        profileImageSrc,
      })
      .then(() => {
        alert('프로필 이미지 변경이 완료 되었습니다');
        localStorage.setItem('userImg', profileImageSrc);
      })
      .catch(error => {
        if (error.response.status == 500) {
          alert(`서버 에러`);
        }
      });
  }
  return (
    <div className={styles.profile_img}>
      <img src={userImg} alt="userProfileImage" />
      <div className={styles.profile_put}>
        <FontAwesomeIcon icon={faCameraRetro} className={styles.icon} />
        <input
          type="file"
          id="profile_upload"
          accept="image/*"
          onChange={e => {
            onChangeImg(e);
          }}
        />
      </div>
    </div>
  );
};

Index.propTypes = {
  userImg: PropTypes.string,
  setUserImg: PropTypes.func,
};

export default Index;
