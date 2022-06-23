const passport = require('passport');
const bcrypt = require('bcrypt');

const { Strategy: LocalStrategy } = require('passport-local');
const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");
const { User } = require('../models');

module.exports = () => {
    passport.use(
        "signin",
        new LocalStrategy({
            usernameField: 'id',
            passwordField: 'paw',
    }, async (id, paw, done) => {
        try {
            const user = await User.findOne({
                where: { id }
            });
            if(!user) {
                return done(null, false, { reason: '존재하지 않는 아이디입니다!' })
            }
            const result = await bcrypt.compare(paw, user.paw);
            if(result) {
                return done(null, user);
            }
            return done(null, false, { reason: '비밀번호가 틀렸습니다' });
        } catch(error) {
            return done(error);
        }
    }));
}


passport.use(
    "jwt",
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey: "jwt-secret-key",
        },
        async (jwtPayload, done) => {
            try {
                const user = await User.findOne({
                    where: {
                        username: jwtPayload.username
                    }
                })
                if (user) {
                    done(null, user);
                }
            } catch (error) {
                console.error(error);
                return done(error);
            }
        }
    )
)