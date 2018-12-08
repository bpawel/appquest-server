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
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
quizResultSchema.method({
    transform() {
      const transformed = {};
      const fields = ['id', 'name', 'type', 'instructor', 'createdAt'];

      // do przetestowania, nie wiem czy działa
      Object.assign(transformed, ...fields.map(key => ({ [key]: this[key] })));

      return transformed;
    },
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
