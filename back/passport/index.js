const kakao = require("./kakao");
const naver = require("./naver");
const google = require("./google");
const local = require("./local");

module.exports = () => {
  kakao();
  naver();
  google();
};
