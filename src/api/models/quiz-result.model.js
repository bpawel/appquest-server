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

/**
 * Quiz Schema
 * @private
 */
const quizResultSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  correctAnswersCount: {
    type: mongoose.Schema.Types.Number,
  },
  questionsCount: {
    type: mongoose.Schema.Types.Number,
  }
}, {
  timestamps: true,
});

/**
 * Methods
 */
quizResultSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'quiz', 'user', 'correctAnswersCount', 'questionsCount', 'createdAt'];

      // do przetestowania, nie wiem czy działa
      Object.assign(transformed, ...fields.map(key => ({ [key]: this[key] })));

      return transformed;
    },
});
quizResultSchema.statics = {

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
          path: 'quiz',
          ref: 'Quiz',
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
    page = 1, perPage = 1000, quiz, user, correctAnswersCount, questionsCount, createdAt,
  }) {
    const options = omitBy({ quiz, user, correctAnswersCount, questionsCount, createdAt }, isNil);

    return this.find(options)
      .sort({ createdAt: 1 })
      .skip(perPage * (page - 1))
      .populate({
        path: 'quiz',
        ref: 'Quiz',
      })
      .limit(perPage)
      .exec();
  },

};

module.exports = mongoose.model('QuizResult', quizResultSchema);
