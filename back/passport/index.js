// const passport = require('passport');
// const local = require('./local');
// const { User } = require('../models');

// module.exports = () => {
//     passport.serializeUser(() => {
//         done(user.id);
//     })

//     passport.deserializeUser(async () => {
//         try{
//             const user = await User.findOne({ where: { id }});
//             done(null, user);
//         } catch (error) {
//             console.error(error)
//             done(error);
//         }
//     });

//     local();
// }