const passport = require('passport')
const KakaoStrategy = require('passport-kakao');

const User = require('../models/user')

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientId: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',     
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
            console.log(profile)
            const exUser = await User.findOne({
                where: { snsId: profile.id},
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email: profile._json && profile.__json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};