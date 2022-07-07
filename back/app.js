//외부모듈
const express = require("express");
const app = express();
const { createServer } = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const { createServer } = require("http");
const bodyParser = require("body-parser");
//내부모듈
const calendarRouter = require("./routes/calendar");
const eventRouter = require("./routes/event");
const userRouter = require("./routes/user");
const db = require("./models");
const passportConfig = require("./passport/local");
const httpServer = createServer(app);

//서버 가동
dotenv.config();
// const redisClient = redis.createClient({
//   url: `redis://${process.env.REDIS_HOST}:$(process.env.REDIS_PORT)`,
//   password: process.env.REDIS_PASSWORD,
// })
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
app.use("/api/event", eventRouter);

app.get("/", (req, res) => {
  res.send("hello");
});

//포트 설정
httpServer.listen(80);
