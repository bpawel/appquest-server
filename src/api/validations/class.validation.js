/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
const Joi = require('joi');
const Class = require('../models/class.model');

module.exports = {

  // GET /v1/class
  listClass: {
    query: {
      name: Joi.string(),
      description: Joi.string(),
      instructor: Joi.string(),
    },
  },

  // POST /v1/class
  createClass: {
    body: {
        name: Joi.string().min(2),
        description: Joi.string().min(2),
        instructor: Joi.string(),
    },
  },

  // PUT /v1/classId
  replaceClass: {
    body: {
        name: Joi.string(),
        description: Joi.string(),
        instructor: Joi.string(),
    },
    params: {
      classId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/:classId
  updateClass: {
    body: {
        name: Joi.string(),
        description: Joi.string(),
        instructor: Joi.string(),
    },
    params: {
      classId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};