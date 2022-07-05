const express = require("express");
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { sequelize } = require("../models");
const { User } = require("../models");
const { Calendar } = require("../models");
const { CalendarMember } = require("../models");
const { Invite } = require("../models");
const { verifyToken } = require("./middlewares");



router.post("/createGroupCalendar", async (req, res, next) => {
  /*
    {
      "calendarName" : ,
    }
  */
  const t = await sequelize.transaction()
  const f = await sequelize.transaction()
  try {
    const exUser = await User.findOne({
      id: 1
    })

    const createdCalendar = await Calendar.create({
      name: req.body.calendarName
      
    }, {transaction: t })
    await createdCalendar.addCalendarMembers(exUser, {transaction: t })
    await t.commit()

    const setAuthority = await CalendarMember.findOne({ 
      where: {
        [Op.and]: {
          UserId: exUser.id,
          CalendarId: createdCalendar.id
        }
      }
    }, {transaction: f })
    console.log(setAuthority)
    await setAuthority.update({
      authority: 3
    })

    await f.commit()
    res.status(200).send({ success: true })
  } catch(error) {
    console.error(error)
    await t.rollback()
    await f.rollback()
    next(error)
  }
});

router.post("/inviteGroupCalendar", async (req, res, next) => {
  /*
    {
      "invitedUserEmail": "Lempi_Johns31@hotmail.com",
      "calendarId": 2
    } 
  */
    const t = await sequelize.transaction();
  try{
    const exUser = await User.findOne({
      where: {
        id: 1
      }
    })
  
    const invitedUser = await User.findOne({
      email: req.body.invitedUserEmail
    })

    // 초대를 받는 유저가 존재하지 않을경우
    if (!invitedUser) {
      return res
        .status(400)
        .send({ message: "해당 이메일을 가진 유저가 존재하지 않습니다" })
    }
    const exCalendar = await Calendar.findOne({
      where: {
        id: req.body.calendarId
      }
    })

    // 캘린더가 존재하지 않을경우
    if (!exCalendar) {
      return res
        .status(400)
        .send({ message: "캘린더가 존재하지 않습니다" })
    }

    const checkAuthority = await CalendarMember.findOne({
      CalendarId: req.body.calendarId,
      UserId: exUser.id
    })
    // 해당 캘린더에서 초대한 유저가 갖는 권한 확인
    if(!checkAuthority == 3 || !checkAuthority == 2) {
      return res
        .status(400)
        .send({ message: "초대할 권한이 없는 유저입니다" })
    }
    
    const overlapCheck = await Invite.findOne({
      where: {
        CalendarGuestId: invitedUser.id,
      }
    })

    // 이미 초대한 유저인지 확인
    if (overlapCheck) {
      return res
        .status(400)
        .send({ message: "이미 초대한 유저입니다" })
    }
    await Invite.create({
      HostCalendarId: exCalendar.id,
      CalendarGuestId: invitedUser.id,
      CalendarHostId: exCalendar.OwnerId
    })
    res.status(200).send({ success: true })
  } catch(error) {
    console.error(error)
    next(error)
  }
});

router.post("/acceptCalendarInvite", async (req, res, next) => {
  /*
    {
      "HostCalendarId": ,
      "CalendarGuestId": 
    }
  */
  t = await sequelize.transaction()
  try {
    const exUser = await User.findOne({
      id: 1
    })
    // 초대받는 사람이 유저가 정말 맞는지
    if (exUser.id != req.body.CalendarGuestId) {
      return res
        .status(400)
        .send({ message: "초대받은 유저가 승낙 버튼을 누른게 아닙니다" })
    }
    
    const exCalendar = await Calendar.findOne({
      id: req.body.HostCalendarId
    })

    // 초대받으려는 캘린더가 존재하는지
    if (!exCalendar) {
      return res
        .status(400)
        .send({ message: "초대를 받은 캘린더가 존재하지 않습니다" })
    }

    // 캘린더맴버에 추가
    await CalendarMember.create({
      UserId: req.body.CalendarGuestId,
      CalendarId: req.body.HostCalendarId
    },  { transaction: t })

    // 초대 요청 삭제
    await Invite.destroy({
      where: {
        [Op.and]: {
          HostCalendarId: req.body.HostCalendarId,
          CalendarGuestId: req.body.CalendarGuestId
        }
      }
    }, { transaction: t })
    
    t.commit()
    res.status(200).send({ success: true })
  } catch(error) {
    console.error(error)
    await t.rollback()
    next(error)
  }
});

router.post("/rejectCalendarInvite", async (req, res, next) => {
   /*
    {
      "HostCalendarId": ,
      "CalendarGuestId": 
    }
  */
  try {
    const exUser = await User.findOne({
      id: 1
    })
    // 초대를 거절한 사람이 유저가 정말 맞는지
    if (exUser.id != req.body.CalendarGuestId) {
      return res
        .status(400)
        .send({ message: "초대받은 유저가 거절 버튼을 누른게 아닙니다" })
    }

    // 초대 요청 삭제
    await Invite.destroy({
      where: {
        [Op.and]: {
          HostCalendarId: req.body.HostCalendarId,
          CalendarGuestId: req.body.CalendarGuestId
        }
      }
    })
    
    res.status(200).send({ success: true })
  } catch(error) {
    console.error(error)
    next(error)
  }
});

router.post("/giveAuthority", async (req, res, next) => {
  /*
    {
      "calendarId":
      "acceptedAuthorityUser"
      "AuthrotyLevel"
    }
  */
  try {
    const exUser = await User.findOne({
      id: 1
    })

    const exCalendar = await Calendar.findOne({
      id: req.body.calendarId
    })

    // 권한을 주려는 유저가 캘린더의 주인이 맞는지
    if (exUser.id != exCalendar.OwnerId) {
      return res
        .status(400)
        .send({ message: "권한을 주려는 유저가 그룹 캘린더의 주인이 아닙니다" })
    }

    const calendarMemberCheck = await CalendarMember.findOne({
      where: {
        [Op.and]: {
            UserId : req.body.acceptedAuthorityUser,
            CalendarId: req.body.calendarId
          }
        }
      })
    console.log(calendarMemberCheck)
    // 권한을 받는 유저가 캘린더에 속해 있는지
    if (!calendarMemberCheck) {
      return res
        .status(400)
        .send({ message: "권한을 받는 유저가 캘린더에 속해있지 않습니다" })
    }

    // 권한 업데이트
    await calendarMemberCheck.update({
      authority: req.body.AuthrotyLevel
    })
    return res.status(200).send({ success: true })
  } catch(error) {
    console.error(error)
    next(error)
  }
});

module.exports = router;
