/* eslint-disable space-in-parens */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-else-return */
/* eslint-disable no-trailing-spaces */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
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
const crypto = require('crypto');
const util = require('util');

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
    const sendMail = util.promisify(transporter.sendMail);


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

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const token = await crypto.randomBytes(20).toString('hex');
      user.resetPassword = token;
      user.resetPasswordExpires = Date.now() + 86400000;
      await user.save();
      
      let data = {
        to: user.email,
        from: 'appqproject@gmail.com',
        subject: 'Reset hasła',
          html: 'Witaj,  ' + user.email + '\n\n' +
            '<p>Kliknij poniższy link lub wklej go do przeglądarki, aby ukończyć proces:<br>' +
            '<a href="http://localhost:8080/reset-password?token=' + token + '">http://localhost:8080/reset-password?token=' + token + '</a></p><br><p>' +
            'Jeśli nie poprosiłeś o to, zignoruj ten e-mail, a twoje hasło pozostanie niezmienione.</p>'
      };
      // setup email data with unicode symbols

      try {
        await (new Promise((resolve, reject) => {
          transporter.sendMail(data, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
       }));
      } catch (err) {
        throw new Error('Ooops! Coś poszło nie tak!' + err.message);
      }
      
      return res.json({ message: 'Dalsze instrukcje zostały wysłane na pocztę e-mail.' });
    }
  } catch (error) {
    return next(error);
  }
};
/**
 * Reset password
 */

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ resetPassword: token, resetPasswordExpires: {$gt: Date.now()} });

    if (!user) {
      throw new Error('Ooops! Nie udało się zmienić Twojego hasła. Link, którego próbujesz użyć, jest nieprawidłowy lub wygasł.');
    }

    user.password = req.body.password;
    user.resetPassword = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
        return res.json({ message: 'Gotowe! Możesz teraz zalogować się na swoje konto przy użyciu nowego hasła.' });
  } catch (error) {
    return next(error);
  }
};
