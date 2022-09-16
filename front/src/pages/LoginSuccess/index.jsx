import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CALENDAR_PATH } from './../../constants/path';
const Index = () => {
  const search = useLocation().search;
  const navigate = useNavigate();

  const saveUserData = async () => {
    var userData = {
      id: new URLSearchParams(search).get('id'),
      email: new URLSearchParams(search).get('email'),
      nickname: new URLSearchParams(search).get('nickname'),
      image: new URLSearchParams(search).get('profileImage'),
      accessToken: new URLSearchParams(search).get('accessToken'),
      refreshToken: new URLSearchParams(search).get('refreshToken'),
      checkedCalendar: new URLSearchParams(search).get('checkedCalendar'),
    };

    localStorage.setItem('refreshToken', JSON.stringify(userData.refreshToken));
    sessionStorage.setItem('accessToken', JSON.stringify(userData.accessToken));

    const id = userData.id;
    const email = userData.email;
    const nickname = userData.nickname;

    localStorage.setItem('userInfo', JSON.stringify({ email, id, nickname }));
    localStorage.setItem('checkedCalendar', userData.checkedCalendar);
    localStorage.setItem('userImg', userData.image);
    localStorage.setItem('local', JSON.stringify(false));
  };

  useEffect(() => {
    saveUserData()
      .then(() => {
        navigate(`${CALENDAR_PATH.MAIN}`);
      })
      .catch(error => {
        console.log(error);
      });
  }, [search, navigate]);

  return <div>로그인 성공</div>;
};

export default Index;
