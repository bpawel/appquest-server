/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const Joi = require('joi');
const Quiz = require('../models/quiz.model');

module.exports = {

  // GET /v1/quiz
  listQuiz: {
    body: {
      name: Joi.string(),
      type: Joi.string(),
      instructor: Joi.string(),
      question: Joi.array().items(Joi.object({
        questionName: Joi.string(),
        type: Joi.string(),
        answers: Joi.array(),
        validAnswers: Joi.array(),
      })),
  },
  },

  // POST /v1/quiz
  createQuiz: {
    body: {
        name: Joi.string(),
        type: Joi.string(),
        instructor: Joi.string(),
        question: Joi.array().items(Joi.object({
          questionName: Joi.string(),
          type: Joi.string(),
          answers: Joi.array(),
          validAnswers: Joi.array(),
        })),
    },
  },

  // PUT /v1/:quizId
  replaceQuiz: {
    body: {
      name: Joi.string(),
      type: Joi.string(),
      instructor: Joi.string(),
      question: Joi.array().items(Joi.object({
        questionName: Joi.string(),
        type: Joi.string(),
        answers: Joi.array(),
        validAnswers: Joi.array(),
      })),
  },
  },

  // PATCH /v1/:quizId
  updateQuiz: {
    body: {
      name: Joi.string(),
      type: Joi.string(),
      instructor: Joi.string(),
      question: Joi.array().items(Joi.object({
        questionName: Joi.string(),
        type: Joi.string(),
        answers: Joi.array(),
        validAnswers: Joi.array(),
      })),
  },
  },
// eslint-disable-next-line eol-last
};