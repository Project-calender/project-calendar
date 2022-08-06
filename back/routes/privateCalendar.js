const express = require('express')
const router = express.Router()

const { sequelize, PrivateCalendar, Calendar } = require('../models')
const authJWT = require('../utils/authJWT')

router.post('/editPrivateCalendar', authJWT, async (req, res, next) => {
    try {
        const changeCalendar = await PrivateCalendar.findOne({
            where: {
                id: req.body.calendarId
            }
        })

        if (!exPrivateCalendar) {
            return res.status(400).send({ message: "개인 캘린더 조회 결과가 없습니다 입력값을 다시 확인해주세요" })
        } 
        // console.log(exPrivateCalendar.UserId)
        if (req.myId != exPrivateCalendar.UserId) {
            return res.status(401).send({ message: "수정 시도하는 유저가 개인 캘린더의 주인이 아닙니다"})
        }

        changeCalendar.update({
            name: req.body.newCalendarName,
            color: req.body.newCalendarColor
        })

        res.status(200).send({ changeCalendar })
    } catch (e) {
        console.error(e)
        next(e)
    }
})

module.exports = router