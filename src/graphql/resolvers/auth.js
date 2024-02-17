const User = require("./../../models/user");
const bcrypt = require("bcryptjs");
const { events } = require("./meta");
const jwt = require('jsonwebtoken')

module.exports = {
    createUser: async (args) => {
        try {
          const findUser = await User.findOne({ email: args.userInput.email });
          if (findUser) {
            throw new Error("User already exists!");
          }
          const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
          const newUser = new User({
            email: args.userInput.email,
            password: hashedPassword,
          });
          const userCreatedResult = await newUser.save();
          return { ...userCreatedResult._doc, _id: userCreatedResult.id };
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      users: async () => {
        try {
          const users = await User.find();
          const userRes = users.map((user) => {
            return {
              ...user._doc,
              _id: user.id,
              createdEvents: events.bind(this, user.createdEvents),
            };
          });
          return userRes;
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      login: async ({email, password}) => {
         const user = await User.findOne({email: email});
         if(!user) {
          throw new Error('User does not exist!');
         }

         const isPasswordMatched = await bcrypt.compare(password, user.password);
         if(!isPasswordMatched){
          throw new Error('Incorrect password!');
         }

         const token = jwt.sign({userId: user.id, email: user.email}, process.env.HASH_KEY, {
          expiresIn: process.env.TOKEN_DURATION
         });

         return {
          userId: user.id,
          token,
          tokenExpiration: 1
         }
      }
}