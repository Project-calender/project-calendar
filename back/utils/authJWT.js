const { verify } = require("./jwt-util");

const authJWT = (req, res, next) => {
  req.headers.authorization = req.headers.authorization.substr(1);
  req.headers.authorization = req.headers.authorization.slice(0, -1);

  if (req.headers.authorization) {
    const token = req.headers.authorization; // header에서 access token을 가져옵니다.
    const result = verify(token); // token을 검증합니다.
    if (result.ok) {
      // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
      req.myId = result.id;
      next();
    } else {
      // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
      res.status(401).send({
        ok: false,
        message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
      });
    }
  } else {
    //세션 스토리지에 access 토큰이 없는 경우
    res.status(401).send({
      ok: false,
      message: "accessToken이 지급되지 않았습니다",
    });
  }
};
//dasdas
module.exports = authJWT;
// const IsNotLoggedIn = (req, res, next) => {
//   if (!req.headers.authorization) {
//     const token = req.headers.authorization; // header에서 access token을 가져옵니다.
//     const result = verify(token); // token을 검증합니다.
//     if (result.ok) { // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
//       req.id = result.id;
//       req.role = result.role;
//       next();
//     } else { // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
//       res.status(401).send({
//         ok: false,
//         message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
//       });
//     }
//   }
// };
