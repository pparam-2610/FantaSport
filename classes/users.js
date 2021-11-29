const User = require('../models/users');

class Users{
    static async register(profile) {
        const newUser = new User({
            googleId:profile.id,
            userId:profile.emails[0].value,
            name:profile.displayName,
            admin: false,
        })
        await newUser.save();
        console.log('New User saved: ',newUser);
        return newUser;
    }
}

module.exports = Users;