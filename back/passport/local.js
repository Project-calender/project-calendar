const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        pawField: 'paw',
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
            jwt
        }
    )
)