const jwt = require("jsonwebtoken");
const { redisClient } = require("../redis");

const verify = (token) => {
  try {
    var decoded = jwt.verify(token, "jwt-secret-key");
    return {
      ok: true,
      id: decoded.id,
    };
  } catch (err) {
    const error = err;
    return {
      ok: false,
      message: error.message,
    };
  }
};

const authJWT = async (req, res, next) => {
  var accessToken = req.headers.authorization.substr(1);
  accessToken = accessToken.slice(0, -1);

  if (!accessToken) {
    return res
      .status(409)
      .send({ message: "accessToken이 지급되지 않았습니다" });
  }

  var result = verify(accessToken);

  if (result.ok) {
    req.myId = result.id;
    next();
  } else {
    if (result.message == "jwt expired") {
      return res.status(401).send({ message: result.message });
    } else if (result.message == "jwt malformed") {
      return res.status(409).send({ message: result.message });
    } else {
      return res.status(500).send({ message: "server error" });
    }
  }
};

const refresh = async (req, res, next) => {
  try {
    var accessToken = req.headers.authorization.substr(1);
    accessToken = accessToken.slice(0, -1);

    var refreshToken = req.headers.refresh.substr(1);
    refreshToken = refreshToken.slice(0, -1);

    if (!accessToken) {
      return res
        .status(405)
        .send({ message: "accessToken이 지급되지 않았습니다" });
    }

    if (!refreshToken) {
      return res
        .status(406)
        .send({ message: "refreshToken이 지급되지 않았습니다" });
    }

    var result = verify(refreshToken);

    if (result.ok) {
      console.log("ok");
      const newAccessToken = jwt.sign({ id: result.id }, "jwt-secret-key", {
        algorithm: "HS256",
        expiresIn: "10s",
      });

      return res.status(200).send({
        ok: true,
        data: { accessToken: newAccessToken },
      });
    } else {
      if (result.message == "jwt expired") {
        return res
          .status(407)
          .send({ message: "세션이 만료되었습니다 다시 로그인 해주세요" });
      } else if (result.message == "jwt malformed") {
        return res.status(401).send({ message: result.message });
      } else {
        return res.status(500).send({ message: "server error" });
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  authJWT: authJWT,
  refresh: refresh,
};
