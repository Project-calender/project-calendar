import Axios from 'axios';
import { BASE_URL } from '../constants/api';

const axios = Axios.create({
  baseURL: BASE_URL,
});

axios.interceptors.request.use(
  function (config) {
    const accessToken = sessionStorage.getItem('accessToken'); // access 토큰을 가져오는 변수
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

//AccessToken이 만료됐을때 처리
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (err) {
    const originalConfig = err.config;

    //조건문 상태코드 확인 필요함
    if (err.response.status === 401) {
      let accessToken = sessionStorage.getItem('accessToken');
      let refreshToken = localStorage.getItem('refreshToken');
      try {
        const data = await Axios({
          url: `http://158.247.214.79/api/user/refresh`, //aws url http://158.247.214.79 요청
          method: 'GET',
          headers: {
            authorization: accessToken,
            refresh: refreshToken,
          },
        });
        if (data) {
          sessionStorage.setItem(
            'accessToken',
            JSON.stringify(data.data.data.accessToken),
          );
          return await axios.request(originalConfig);
        }
      } catch (err) {
        console.log('토큰 갱신 에러', err);
      }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  },
);

export default axios;

/*
사용 방법
import axios from './파일 위치';
const result = await axios.get(`/ajax경로`);
*/
