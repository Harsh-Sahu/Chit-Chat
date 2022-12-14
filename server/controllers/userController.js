const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Messages = require("../models/messageModel");
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.lockList = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    const { from, to, work } = req.body;
    if (work === "lock") {
      const messages = await Messages.updateMany(
        {
          users: {
            $all: [from, to],
          },
        },
        {
          lock_status: true,
        }
      );
    }
    if (work === "unlock") {
      const messages = await Messages.updateMany(
        {
          users: {
            $all: [from, to],
          },
        },
        {
          lock_status: false,
        }
      );
    }
  } catch (ex) {
    next(ex);
  }
};

// const API_KEY =
//   "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";

let transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

module.exports.unlockList = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    const { from, to, work } = req.body;
    const user = await User.find({ _id: from });
    console.log(user[0].email);

    let OTP = Math.floor(Math.random() * 1000000 + 1);

    // sgMail.setApiKey(API_KEY);

    let mailOptions = {
      from: "chitchatapp101@outlook.com",
      to: user[0].email,
      subject: "OTP for Chit-Chat",
      text: "Your otp to unlock " + user[0].username + " chat is : " + OTP,
    };

    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        console.log("Error Occured", err);
      } else {
        console.log("Email sent");
      }
    });
    // const msg = {
    //   to: user[0].email,
    //   from: "rushi022002@gmail.com",
    //   subject: "OTP for Chit-Chat",
    //   text: "Your otp to unlock " + user[0].username + "chat is : " + OTP,
    // };

    // sgMail
    //   .send(msg)
    //   .then((res) => console.log("email sent"))
    //   .catch((err) => console.log(err.message));

    return res.json({
      otp: OTP,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
