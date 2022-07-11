import axios from 'axios';

const instance = axios.create({
  baseURL: `http://15.164.226.74`,
});

instance.interceptors.request.use(
  function (config) {
    const accessToken = sessionStorage.getItem('accessToken'); // access 토큰을 가져오는 변수
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

//AccessToken이 만료됐을때 처리
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (err) {
    const originalConfig = err.config;

    //조건문 상태코드 확인 필요함
    if (err.response && err.response.status === 401) {
      const refreshToken = originalConfig.headers['refreshToken'];
      try {
        const data = await axios({
          url: `http://15.164.226.74/`, //ajax 요청 url
          method: 'GET',
          headers: {
            Authorization: refreshToken,
          },
        });
        if (data) {
          localStorage.setItem(
            'refreshToken',
            JSON.stringify(data.data, ['refreshToken']),
          );
          sessionStorage.setItem(
            'accessToken',
            JSON.stringify(data.data, ['accessToken']),
          );
          return await instance.request(originalConfig);
        }
      } catch (err) {
        console.log('토큰 갱신 에러');
      }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  },
);

export default instance;

/*
사용 방법
import instance from './파일 위치';
const result = await instance.get(`/ajax경로`);
*/
