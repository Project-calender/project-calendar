const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require("jsonwebtoken");

const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

const router = express.Router()

// const { verifyToken } = require('./middleware');

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('signin' ,(err, user, info) => {
        try{
            console.log("??")
            if (err) {
                console.error(err);
                next(err);
            }
            if(info) {
                return res.status(401).send(info);
            }
            return req.login(user, { session: false },async (loginErr) => {
                if (loginErr) {
                    return next(loginErr);
                }
                const refreshToken = jwt.sign(
                    {
                        sub: "refresh",
                        id: user.id,
                    },
                    "jwt-secret-key",
                    { expiresIn: "24h" }
                );
                const accessToken = jwt.sign(
                    {
                        sub: "access",
                        id: user.id
                    },
                    "jwt-secret-key",
                    {
                        expiresIn: "5m",
                    }
                );
                const fullUserWithoutPassword = await User.findOne({
                    where: { id: user.id },
                    attributes: {
                        exclude: ['paw']
                    }
                })
                console.log("로그인 성공 확인")
                return res.status(200).send({
                    fullUserWithoutPassword,
                    refreshToken,
                    accessToken,
                });
            })
        } catch (error) {
            console.log(error);
            next(error);
        }
    })(req, res, next);
});

router.post('/signup', isNotLoggedIn, async (req, res, next) => {
    try{
        const exUser = await User.findOne({
            where: {
                id: req.body.id,
            }
        });
        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디입니다.')
        }   
        const hashedPassword = await bcrypt.hash(req.body.paw, 12)
        await User.create({
            id: req.body.email,
            paw: hashedPassword,
            name: req.body.name,
            email: req.body.email,
            
        })
        res.status(201).send('ok');
        // res.status(201).send('회원가입이 완료되었습니다.')
        console.log("회원가입 확인")
    } catch (error) {
        console.log(error);
        next(error)
    }
})

router.post("/refreshToken", async (req, res, next) => {
    passport.authenticate(("jwt", { session: false }, (err, user, info) => {
        try {
            if(err) {
                console.error(err);
                return next(err);
            }
            if(info) {
                if (info?.name === "TokenExpiredError") {
                //refresh토큰 마저 만료
                    return res.status(419).send({ error: info.name });
                }
                if (info?.name === "JsonWebTokenError") {
                //refresh토큰 잘못됨
                    return res.status(419).send({ error: info.name });
                }
            }
            //토큰 재발급
            const refreshToken = jwt.sign(
                {
                    sub: "refresh",
                    id: user.id,
                },
                "jwt-secret-key",
                { expiresIn: "24h" }
            );
            const accessToken = jwt.sign(
                { 
                    sub: "access",
                    email: user.email
                },
                "jwt-secret-key",
                {
                    expiresIn: "5m",
                }
            );
            return res.status(200).send({
                id: id,
                name: user.name,
                refreshToken,
                accessToken,
            })
        } catch(error) {
            console.error(error);
            next(error);
        }
    }))
})

router.post('/user/logout', isNotLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
});


module.exports = router