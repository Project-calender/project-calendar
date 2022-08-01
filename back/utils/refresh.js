const { sign, verify, refreshVerify } = require("./jwt-util");
const jwt = require("jsonwebtoken");

const refresh = async (req, res, next) => {
  // access token과 refresh token의 존재 유무를 체크합니다.
  try {
    authToken = req.headers.authorization.substr(1);
    authToken = authToken.slice(0, -1);
    refreshToken = req.headers.refresh.substr(1);
    refreshToken = refreshToken.slice(0, -1);

    if (!authToken && !refreshToken) {
      // access token, refresh token이 모두 헤더에 없는 경우

      res.status(403).send({
        ok: false,
        message: "Access token and refresh token are need for refresh!",
      });
    }

    // access token 검증 -> expired여야 함.
    const authResult = verify(authToken);
    // console.log(authResult, "이거 왜?")
    // access token 디코딩하여 user의 정보를 가져옵니다.
    const decoded = jwt.decode(refreshToken);
    // 디코딩 결과가 없으면 권한이 없음을 응답.
    if (decoded === null) {
      res.status(405).send({
        ok: false,
        message: "No authorized!",
      });
    }

    /* access token의 decoding 된 값에서
      유저의 id를 가져와 refresh token을 검증합니다. */
    const refreshResult = await refreshVerify(refreshToken, decoded.id);

    if (authResult.ok === false && authResult.message === "jwt expired") {
      if (refreshResult === false) {
        res.status(405).send({
          ok: false,
          message: "No authorized!",
        });
      } else {
        const newAccessToken = sign(decoded.id);
        res.status(200).send({
          // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
          ok: true,
          data: {
            accessToken: newAccessToken,
            refreshToken,
          },
        });
      }
    } else {
      res.status(406).send({
        ok: false,
        message: "Access token is not expired!",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = refresh;
