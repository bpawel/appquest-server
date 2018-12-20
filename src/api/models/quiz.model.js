/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

const quizType = ['open', 'closed', 'true/false', 'multiple'];
/**
 * Quiz Schema
 * @private
 */
const quizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  class_: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  }],
  question: [{
    //type: mongoose.Schema.Types.ObjectId,
    questionName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: quizType,
      default: 'closed',
    },
    answers: {
      type: Array,
      required: true,
    },
    validAnswers: {
      type: Array,
      required: true,
    },
  }],
}, {
  timestamps: true,
});

/**
 * Methods
 */
quizSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'name', 'type', 'nameQuestion', 'instructor', 'question', 'class_', 'answers', 'nameAnswer', 'validAnswer', 'createdAt'];

      Object.assign(transformed, ...fields.map(key => ({ [key]: this[key] })));

      return transformed;
    },
  });
    
quizSchema.statics = {

  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let quiz;

      if (mongoose.Types.ObjectId.isValid(id)) {
        quiz = await this.findById(id)
        .populate({
          path: 'class_',
          ref: 'Class',
        })
        .exec();
      }
      if (quiz) {
        return quiz;
      }

      throw new APIError({
        message: 'User does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  list({
    page = 1, perPage = 10, instructor, name, nameQuestion, type, question, class_, answers, nameAnswer, validAnswer,
  }) {
    const options = omitBy({ instructor, name, question, type, nameQuestion, class_, answers, nameAnswer, validAnswer }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .populate({
        path: 'class_',
        select: 'name',
      })
      .limit(perPage)
      .exec();
  },

};
  
module.exports = mongoose.model('Quiz', quizSchema);
