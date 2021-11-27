const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require('../models/users');

module.exports = (passport)=>{

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        // User.findById(id, function(err, user) {
          done(null, id);
        // });
    });

    passport.use(new GoogleStrategy({
        clientID: '571264933736-ht8qcm1onabjas37p69f870mqrqki0kc.apps.googleusercontent.com',
        clientSecret: 'xtiYk6_jr18PpLDbZdwEOR7v',
        callbackURL: "http://localhost:8000/auth/google/callback",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {

        console.log("Checking for new logged in profile: ",profile);

        User.findOne({googleID:profile.id},async(err,user)=>{
            if(err) throw err;

            console.log('User is: ',user);
            if(user){
                await user.populate('serverList').execPopulate();
                console.log("Inside log in: ",user);
                 cb(null,user );
                }   
            else{
                const newUser = new User({
                googleID:profile.id,
                email:profile.emails[0].value,
                displayName:profile.displayName,
                phoneNo:null,
                username:null,
                serverList:[]
                })
                await newUser.save();
                console.log('New User saved: ',newUser);
                cb(null,newUser)
            }
        })
    }));

}