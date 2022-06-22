const express = require('express');
const { User } = require('../models');

const bcrypt = require('bcrypt');

const router = express.Router()

router.post('/login', (req, res, next) => {
    passport.authenticate('local' ,(err, user, info) => {
        if (err) {
            console.error(err);
            next(err);
        }
        if(info) {
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
                attributes: {
                    exclude: ['paw']
                }
            })
            return res.status(200).json(fullUserWithoutPassword);
        })
    })(req, res, next);
});

router.post('/signup', async (req, res) => {
    try{
        const exUser = await User.findOne({
            where: {
                id: req.body.id,
            }
        });
        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.')
        }   
        const hashedPassword = await bcrypt.password(req.body.password, 12)
        await User.create({
            id: req.body.email,
            paw: hashedPassword,
            nickname: req.body.nickname,
        })
        res.status(201).send('ok');
        res.status(201).send('회원가입이 완료되었습니다.')
    } catch (error) {
        console.log(error);
        next(error)
    }
})

router.post('/user/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
});


module.exports = router