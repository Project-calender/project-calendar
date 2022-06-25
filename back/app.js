//외부모듈
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");

//내부모듈
const userRouter = require('./routes/user')
const postRouter = require('./routes/post')
const db = require("./models");
const passportConfig = require("./passport");

//서버 가동
dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);
passportConfig();

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
// app.use(session({
//     saveUninitialized: false,
//     resave: false,
//     secret: process.env.COOKIE_SECRET || "cookie_secret",
// }));
app.use(passport.initialize());

//라우터
app.use("/post", postRouter);
app.use("/user", userRouter);

//포트 설정
app.listen(8080, () => {
  console.log(app.get("port"), "포트에서 연결중입니다");
});
