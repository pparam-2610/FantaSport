const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy=require("passport-local");

const User = require('../models/users');
const Users = require('../classes/users');

module.exports = (passport)=>{

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        // User.findById(id, function(err, user) {
          done(null, id);
        // });
    });

    // passport.use("local-signIn",new LocalStrategy({passReqToCallback:true},
    //     function(req,username,password,done){
    //         let presentSignIn=false
    //         console.log(username,password);
    //         User.findOne({ userId: username, password: password },async(err,user)=>{
    //             if(user){
    //                 done(null,{username:username,password:password});	
    //             } else{
    //                 done(null, false);
    //             }
    //         });     
    //     }
    // ));
    
    // passport.use("local-signUp",new LocalStrategy({passReqToCallback:true},
    //     function(req, username, password, name, done){
    
    //         console.log(username,password);
    //         console.log("BRUHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHhhhhh");
    //         // let sql="SELECT emp_id FROM perSign where emp_id='"+"E00002"+"'"; // username

    //         User.findOne({ userId: username },async(err,user)=>{
    //             if(err) throw err;
    //             if(user){
    //                 console.log("already exists");
    //                 done(null,false);
    //             } else{
    //                 const newUser = new User({
    //                     googleId : null,
    //                     userId: username,
    //                     name: name,
    //                     admin: false,
    //                 })
    //                 await newUser.save();
    //                 console.log('New User saved: ',newUser);
    //                 cb(null,newUser)
    //             }
    //         })
    //     }))

    passport.use(new GoogleStrategy({
        clientID: '571264933736-ht8qcm1onabjas37p69f870mqrqki0kc.apps.googleusercontent.com',
        clientSecret: 'xtiYk6_jr18PpLDbZdwEOR7v',
        callbackURL: "http://localhost:8000/auth/google/callback",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, cb) {

        console.log("Checking for new logged in profile: ",profile);

        User.findOne({ userId:profile.emails[0].value },async(err,user)=>{
            if(err) throw err;

            console.log('User is: ',user);
            if(user){
                // await user.populate('serverList').execPopulate();
                console.log("Inside log in: ",user);
                 cb(null,user );
                }   
            else{
                const newUser = Users.register(profile);
                cb(null,newUser)
            }
        })
    }));

}