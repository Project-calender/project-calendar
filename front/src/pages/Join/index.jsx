import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import {
  faExclamationCircle,
  faAngleRight,
  faCameraRetro,
} from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import { useNavigate } from 'react-router-dom';
import { USER_PATH } from './../../constants/path';
import Axios from 'axios';
import { BASE_URL, USER_URL } from '../../constants/api';

const Index = () => {
  let navigate = useNavigate();
  const [allCheck, setAllCheck] = useState(false);
  const [serviceCheck, setServiceCheck] = useState(false);
  const [eventCheck, setEventCheck] = useState(false);
  const [inpoCheck, setInpoCheck] = useState(false);

  const [inputValue, setInputValue] = useState({
    //userId: '',
    userPassword: '',
    userPasswordCheck: '',
    userEmail: '',
    userName: '',
  });
  let [userEmailCheck, setUserEmailCheck] = useState(false); //이메일 확인 체크
  let [EmailLengthCheck, setEmailLengthCheck] = useState(false); //이메일 글자수 체크
  let [userPasswordCheck, setUserPasswordCheck] = useState(false); //비밀번호 체크
  let [PasswordCheck, setPasswordCheck] = useState(false); //비밀번호 확인 체크
  let [userNameCheck, setUserNameCheck] = useState(false); //이름 체크
  let [fileImg, setFileImg] = useState(''); //사용자가 업로드한 이미지 파일 미리보기 저장
  let [fileData, setFileData] = useState(); //서버로 전송 할 DB에서 받은 프로필 이미지 주소

  // 사용자가 업로드한 이미지 미리보기
  const saveFileImage = e => {
    setFileImg(URL.createObjectURL(e.target.files[0]));
  };

  //input file로 선택한 이미지를 DB로 보내기
  const onChangeImg = e => {
    const uploadFile = e.target.files[0];
    const formData = new FormData();
    formData.append('image', uploadFile);

    Axios.post(`${BASE_URL}${USER_URL.USER_PROFILE_IMAGE}`, formData)
      .then(res => {
        setFileData(res.data.src);
      })
      .catch(error => {
        console.log('이미지 업로드실패', error);
      });
  };

  //회원가입 API 데이터
  const joinData = {
    email: inputValue.userEmail,
    password: inputValue.userPassword,
    nickname: inputValue.userName,
    profileImageSrc: fileData,
  };

  //회원가입 버튼 클릭시 전송
  function sendJoinForm() {
    Axios.post(`${BASE_URL}${USER_URL.SINGUP}`, joinData)
      .then(res => {
        console.log('성공', res);
        navigate(`${USER_PATH.LOGIN}`);
      })
      .catch(error => {
        console.log('실패', error);
        if (error.response.status == 401) {
          alert(`이미 사용중인 이메일 입니다.`);
        }
      });
  }

  //비밀번호 특수문자 검사 정규표현식
  const specialLetter = inputValue.userPassword.search(
    /[`~!@#$%^&*|₩₩₩'₩";:₩/?]/gi,
  );

  //특수문자 1자 이상 전체 8장 이상시 ture 반환
  const validPassword =
    specialLetter >= 0 && inputValue.userPassword.length >= 8;

  //이메일 @와 .이 들어가는지 체크
  const validEmail =
    inputValue.userEmail.includes('@') && inputValue.userEmail.includes('.');

  //inputValue에게 input 값 넣기
  const handleInput = event => {
    const { name, value } = event.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  //input ture,false 체크
  const inputCheck = () => {
    //이메일 체크
    if (validEmail == true) {
      setUserEmailCheck(true);
    } else {
      setUserEmailCheck(false);
    }

    //이메일 글자수 체크
    if (inputValue.userEmail.length >= 5) {
      setEmailLengthCheck(true);
    } else {
      setEmailLengthCheck(false);
    }

    //비밀번호 유효성 검사 체크
    if (validPassword == true) {
      setUserPasswordCheck(true);
    } else {
      setUserPasswordCheck(false);
    }

    //비밀번호 확인 체크
    if (inputValue.userPassword == inputValue.userPasswordCheck) {
      setPasswordCheck(true);
    } else {
      setPasswordCheck(false);
    }

    //이름 2글자 이상 체크
    if (inputValue.userName.length >= 2) {
      setUserNameCheck(true);
    } else {
      setUserNameCheck(false);
    }
  };

  //이용약관 모두 체크
  const allBtnEvent = () => {
    if (allCheck === false) {
      setAllCheck(true);
      setServiceCheck(true);
      setEventCheck(true);
      setInpoCheck(true);
    } else {
      setAllCheck(false);
      setServiceCheck(false);
      setEventCheck(false);
      setInpoCheck(false);
    }
  };

  //이용약관 약관 동의
  const serviceBtnEvent = () => {
    if (serviceCheck === false) {
      setServiceCheck(true);
    } else {
      setServiceCheck(false);
    }
  };

  //이벤트 약관 동의
  const evnetBtnEvent = () => {
    if (eventCheck === false) {
      setEventCheck(true);
    } else {
      setEventCheck(false);
    }
  };

  //개인 정보 수집 약관 동의
  const inpoBtnEvent = () => {
    if (inpoCheck === false) {
      setInpoCheck(true);
    } else {
      setInpoCheck(false);
    }
  };

  //input ture,false 확인후 all input 체크 변경
  useEffect(() => {
    if (serviceCheck === true && eventCheck === true && inpoCheck === true) {
      setAllCheck(true);
    } else {
      setAllCheck(false);
    }
  }, [serviceCheck, eventCheck, inpoCheck, inputValue]);

  //input ture,false 체크 함수 실행
  useEffect(() => {
    inputCheck();
  }, [inputValue]);

  return (
    <div>
      <nav className={styles.join_nav}>
        <em
          onClick={() => {
            navigate('/login');
          }}
        >
          calendar
        </em>
      </nav>
      <section className={styles.section}>
        <form
          className={styles.join_form}
          encType="multipary/form-data"
          method="post"
        >
          <div className={styles.profile}>
            <div className={styles.profile_img}>
              {fileImg ? (
                <img src={fileImg} alt="" />
              ) : (
                <img
                  src={`${process.env.PUBLIC_URL}/img/join/profile.png`}
                  alt=""
                />
              )}
            </div>
            <div className={styles.profile_put}>
              <FontAwesomeIcon icon={faCameraRetro} className={styles.icon} />
              <input
                type="file"
                id="profile_upload"
                accept="image/*"
                onChange={e => {
                  saveFileImage(e);
                  onChangeImg(e);
                }}
              />
            </div>
          </div>
          <div className={`${styles.email} ${styles.join_input_box}`}>
            <input
              type="text"
              placeholder="이메일"
              name="userEmail"
              onChange={e => {
                handleInput(e);
              }}
            />
            {userEmailCheck == false ? (
              <div className={styles.warning}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <p>이메일을 입력해주세요</p>
              </div>
            ) : null}
            {EmailLengthCheck == false ? (
              <div className={styles.warning}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <p>5글자 이상 입력해주세요</p>
              </div>
            ) : null}
          </div>
          <div className={`${styles.password} ${styles.join_input_box}`}>
            <input
              type="password"
              placeholder="비밀번호"
              name="userPassword"
              onChange={e => {
                handleInput(e);
              }}
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              name="userPasswordCheck"
              onChange={e => {
                handleInput(e);
              }}
            />
            {userPasswordCheck == false ? (
              <div className={styles.warning}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <p>8자 이상,특수문자 + 영문,숫자를 입력해주세요</p>
              </div>
            ) : null}
            {PasswordCheck == false ? (
              <div className={styles.warning}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <p>비밀번호를 확인해주세요</p>
              </div>
            ) : null}
          </div>
          <div className={`${styles.name} ${styles.join_input_box}`}>
            <input
              type="text"
              placeholder="이름"
              name="userName"
              onChange={e => {
                handleInput(e);
              }}
            />
            {userNameCheck == false ? (
              <div className={styles.warning}>
                <FontAwesomeIcon icon={faExclamationCircle} />
                <p>이름을 입력해주세요</p>
              </div>
            ) : null}
          </div>
          <div className={styles.terms_service}>
            <div className={styles.all_check_box}>
              <input
                type="checkbox"
                id="all_check"
                checked={allCheck}
                onChange={() => {
                  allBtnEvent();
                }}
              />
              <label htmlFor="all_check">선택 포함 전체 약관 동의</label>
            </div>
            <span className={styles.line}></span>
            <div className={styles.check_box}>
              <input
                type="checkbox"
                id="check1"
                checked={serviceCheck}
                onChange={() => {
                  serviceBtnEvent();
                }}
              />
              <label htmlFor="check1">이용약관 동의(필수)</label>
              <p>
                약관 보기 <FontAwesomeIcon icon={faAngleRight} />
              </p>
            </div>
            <div className={styles.check_box}>
              <input
                type="checkbox"
                id="check2"
                checked={eventCheck}
                onChange={() => {
                  evnetBtnEvent();
                }}
              />
              <label htmlFor="check2">이벤트, 혜택 알림 수신 동의(선택)</label>
              <p>
                약관 보기 <FontAwesomeIcon icon={faAngleRight} />
              </p>
            </div>
            <div className={styles.check_box}>
              <input
                type="checkbox"
                id="check3"
                checked={inpoCheck}
                onChange={() => {
                  inpoBtnEvent();
                }}
              />
              <label htmlFor="check3">개인 정보 수집 및 이용 동의(필수)</label>
              <p>
                약관 보기 <FontAwesomeIcon icon={faAngleRight} />
              </p>
            </div>
          </div>
          {userPasswordCheck == true &&
          PasswordCheck == true &&
          userEmailCheck == true &&
          userNameCheck == true &&
          serviceCheck == true &&
          inpoCheck == true ? (
            <button
              className={styles.join_btt1}
              onClick={e => {
                e.preventDefault();
                sendJoinForm();
              }}
            >
              회원 가입 완료
            </button>
          ) : (
            <button
              className={styles.join_btt2}
              onClick={e => {
                e.preventDefault();
              }}
            >
              회원 가입 완료
            </button>
          )}
        </form>
      </section>
    </div>
  );
};

export default Index;
