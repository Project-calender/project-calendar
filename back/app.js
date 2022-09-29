//외부모듈
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const hpp = require("hpp");
const helmet = require("helmet");
const { createServer } = require("http");
const httpServer = createServer(app);
const path = require("path");
const passport = require("passport");

//내부모듈
const db = require("./models");
const calendarRouter = require("./routes/calendar");
const eventRouter = require("./routes/event");

const alertRouter = require("./routes/alert");
const privateCalendar = require("./routes/privateCalendar");
const authRouter = require("./routes/auth");
const testRouter = require("./routes/test");

// const { restartAll } = require("./realTimeAlerts");
const useSocket = require("./useSocket");
const { startRedis } = require("./redis");

const passportConfig = require("./passport");
//swagger
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerSpec = YAML.load(path.join(__dirname, "swagger.yaml"));

//서버 가동
dotenv.config();
passportConfig();
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(hpp());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

//라우터
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }) //검색 허용가능
);

// restartAll()
//   .then(() => {
//     console.log("restart All alerts completely!");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

app.use("/api/calendar", calendarRouter);
app.use("/api/event", eventRouter);
app.use("/api/alert", alertRouter);
app.use("/api/privateCalendar", privateCalendar);
app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);

app.use(function (error, req, res, next) {
  res.json({ message: error.message });
});

app.get("/", (req, res) => {
  res.send("jenkins why");
});

useSocket(httpServer, app);

//포트 설정
httpServer.listen(80);

startRedis();
