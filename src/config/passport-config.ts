import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
const localStrategy = require('passport-local').Strategy;
import { UserModel } from '@/models/User'; // Assuming you have your User model in a file named user.model.ts
import { CommonConfig } from './common';
import { getUserByEmail, getUserById, registerUser, verifyLogin } from '@/service/userService';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: CommonConfig.JWT_SECRET, // Replace with your actual secret key
  session: false
};


passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email: string, password: string, done: any) => {
      try {
        const result = await verifyLogin({email, password});
        if(!result?.isValid || !result.user){
          return done(null, false);
        }
        return done(null, result.user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  // console.log("jwtPayload", jwtPayload)
  try {
    const user = await getUserById(jwtPayload.user._id)
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    console.log("Error", error)
    return done(error, false);
  }
}));

export default passport;