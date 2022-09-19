// if (req.body.alerts.length > 0) {
//   if (req.body.allDay === 1) {
//     await Promise.all(
//       req.body.alerts.map(async (alert) => {
//         if (alert.type === "day") {
//           const content = `${req.body.eventName}시작 ${alert.time}일 전 입니다`;
//           const date = new Date(req.body.startTime);
//           date.setDate(date.getDate() - alert.time);
//           date.setHours(alert.hour);
//           date.setMinutes(parseInt(alert.minute ? alert.minute : 0));
//           await addAlert(
//             req.myId,
//             groupEvent.id,
//             req.body.calendarId,
//             req.body.allDay,
//             alert.type,
//             alert.time,
//             alert.hour,
//             alert.minute,
//             content,
//             date,
//             req.myId,
//             req.app.get("io"),
//             req.app.get("onlineUsers")
//           );
//         } else if (alert.type === "week") {
//           const content = `${req.body.eventName}시작 ${alert.time}주 전 입니다`;
//           const date = new Date(req.body.startTime);
//           date.setDate(date.getDate() - alert.time * 7);
//           date.setHours(alert.hour);
//           date.setMinutes(parseInt(alert.minute ? alert.minute : 0));

//           await addAlert(
//             req.myId,
//             groupEvent.id,
//             req.body.calendarId,
//             req.body.allDay,
//             alert.type,
//             alert.time,
//             alert.hour,
//             alert.minute,
//             content,
//             date,
//             req.myId,
//             req.app.get("io"),
//             req.app.get("onlineUsers")
//           );
//         }
//       })
//     );
//   } else {
//     await Promise.all(
//       req.body.alerts.map(async (alert) => {
//         if (alert.type === "minute") {
//           const content = `${req.body.eventName}시작 ${alert.time}분 전입니다!`;
//           const date = new Date(req.body.startTime);
//           date.setMinutes(date.getMinutes() - parseInt(alert.time));
//           await addAlert(
//             req.myId,
//             groupEvent.id,
//             req.body.calendarId,
//             req.body.allDay,
//             alert.type,
//             alert.time,
//             null,
//             null,
//             content,
//             date,
//             req.myId,
//             req.app.get("io"),
//             req.app.get("onlineUsers")
//           );
//         } else if (alert.type === "hour") {
//           const content = `${req.body.eventName}시작 ${alert.time}시간 전입니다!`;
//           const date = new Date(req.body.startTime);

//           date.setHours(date.getHours() - parseInt(alert.time));
//           await addAlert(
//             req.myId,
//             groupEvent.id,
//             req.body.calendarId,
//             req.body.allDay,
//             alert.type,
//             alert.time,
//             null,
//             null,
//             content,
//             date,
//             req.myId,
//             req.app.get("io"),
//             req.app.get("onlineUsers")
//           );
//         } else if (alert.type === "day") {
//           const content = `${req.body.eventName}시작 ${alert.time}일 전입니다!`;
//           const date = new Date(req.body.startTime);
//           date.setDate(date.getDate() - parseInt(alert.time));
//           await addAlert(
//             req.myId,
//             groupEvent.id,
//             req.body.calendarId,
//             req.body.allDay,
//             alert.type,
//             alert.time,
//             null,
//             null,
//             content,
//             date,
//             req.myId,
//             req.app.get("io"),
//             req.app.get("onlineUsers")
//           );
//         } else if (alert.type === "week") {
//           const content = `${req.body.eventName}시작 ${alert.time}주 전입니다!`;
//           const date = new Date(req.body.startTime);
//           date.setDate(date.getDate() - parseInt(alert.time) * 7);
//           await addAlert(
//             req.myId,
//             groupEvent.id,
//             req.body.calendarId,
//             req.body.allDay,
//             alert.type,
//             alert.time,
//             null,
//             null,
//             content,
//             date,
//             req.myId,
//             req.app.get("io"),
//             req.app.get("onlineUsers")
//           );
//         }
//       })
//     );
//   }
// }
