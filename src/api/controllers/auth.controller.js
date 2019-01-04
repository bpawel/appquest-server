/* eslint-disable linebreak-style */
/* eslint-disable prefer-template */
/* eslint-disable operator-linebreak */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable func-names */
/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
/* eslint-disable import/order */
/* eslint-disable comma-dangle */
/* eslint-disable prefer-const */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
const httpStatus = require('http-status');
const moment = require('moment-timezone');
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const { jwtExpirationInterval } = require('../../config/vars');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'appqproject@gmail.com', // generated ethereal user
            pass: 'appq123456' // generated ethereal password
        }
    });


/**
* Returns a formated object with tokens
* @private
*/
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType, accessToken, refreshToken, expiresIn,
  };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
  try {
    const user = await (new User(req.body)).save();
    const userTransformed = user.transform();
    const token = generateTokenResponse(user, user.token());
    res.status(httpStatus.CREATED);
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
};

/**
 * Returns jwt token if valid email and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
  try {
    const { user } = req;
    const accessToken = user.token();
    const token = generateTokenResponse(user, accessToken);
    const userTransformed = user.transform();
    return res.json({ token, user: userTransformed });
  } catch (error) {
    return next(error);
  }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      token: refreshToken,
    });
    const { user, accessToken } = await User.findAndGenerateToken({ email, refreshObject });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
};

exports.forgotPassword = function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({
        email: req.body.email
      }).exec((err, user) => {
        if (user) {
          done(err, user);
        } else {
          done('User not found.');
        }
      });
    },
    function (user, done) {
      // create the random token
      crypto.randomBytes(20, (err, buffer) => {
        var token = buffer.toString('hex');
        done(err, user, token);
      });
    },
    function (user, token, done) {
      User.findByIdAndUpdate({ _id: user._id }, { resetPassword: token, resetPasswordExpires: Date.now() + 86400000 }, { upsert: true, new: true }).exec((err, newUser) => {
        done(err, token, newUser);
      });
    },
    function (token, user, done) {
      let data = {
        to: user.email,
        from: 'appqproject@gmail.com',
        subject: 'Password Reset',
        text: 'Welcome ' + user.email + '\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:8080/reset-password?token=' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };

      // setup email data with unicode symbols
      transporter.sendMail(data, (err) => {
        if (!err) {
          return res.json({ message: 'Kindly check your email for further instructions' });
        }
          return done(err);
      });
    }
  ], err => res.status(422).json({ message: err }));
};

/**
 * Reset password
 */
exports.resetPassword = function (req, res, next) {
  User.findOne({
    resetPassword: req.body.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }).exec((err, user) => {
    if (!err && user) {
      if (req.body.newPassword === req.body.verifyPassword) {
        user.hashPassword = bcrypt.hashSync(req.body.newPassword, 10);
        user.resetPassword = undefined;
        user.resetPasswordExpires = undefined;
        user.save((err) => {
          if (err) {
            return res.status(422).send({
              message: err
            });
          }
            // eslint-disable-next-line vars-on-top
            var data = {
              to: user.email,
              from: 'appqproject@gmail.com',
              text: 'TEST',
              subject: 'Password Reset Confirmation',
            };

            transporter.sendMail(data, (err) => {
              if (!err) {
                return res.json({ message: 'Password reset' });
              }
                return done(err);
            });
        });
      } else {
        return res.status(422).send({
          message: 'Passwords do not match'
        });
      }
    } else {
      return res.status(400).send({
        message: 'Password reset token is invalid or has expired.'
      });
    }
  });
};
