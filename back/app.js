//외부모듈
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
//내부모듈
const userRouter = require("./routes/user");
const calendarRouter = require("./routes/calendar");
const db = require("./models");
const passportConfig = require("./passport/local");

//서버 가동
dotenv.config();
app.use(passport.initialize());
passportConfig();
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//미들웨어
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//라우터
app.use("/api/user", userRouter);
app.use("/api/calendar", calendarRouter);

//포트 설정
app.listen(8080, () => {
  console.log(app.get("port"), "포트에서 연결중입니다");
});
