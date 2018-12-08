/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
* User Roles
*/

/**
 * Class Schema
 * @private
 */
const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    index: true,
    trim: true,
  },
  description: {
    type: String,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

/**
 * Methods
 */
classSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'name', 'description', 'instructor', 'users', 'createdAt'];

      // do przetestowania, nie wiem czy działa
      Object.assign(transformed, ...fields.map(key => ({ [key]: this[key] })));

      return transformed;
    },
  });


classSchema.statics = {


  /**
   * Get class
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let class_;

      if (mongoose.Types.ObjectId.isValid(id)) {
        class_ = await this.findById(id)
        .populate({
          path: 'instructor',
          select: 'email',
        })
        .populate({
          path: 'users',
          select: 'email',
        })
        .exec();
      }
      if (class_) {
        return class_;
      }

      throw new APIError({
        message: 'Class does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },


  list({
    page = 1, perPage = 10, instructor, users, name, description,
  }) {
    const options = omitBy({ instructor, name, users, description }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .populate({
        path: 'instructor',
        select: 'email',
      })
      .populate({
        path: 'users',
        select: 'email',
      })
      .exec();
  },
};

module.exports = mongoose.model('Class', classSchema);
