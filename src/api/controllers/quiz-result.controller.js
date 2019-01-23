/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-unresolved */
const httpStatus = require('http-status');
const { omit } = require('lodash');
const QuizResult = require('../models/quiz-result.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load quizResult and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const quizResult = await QuizResult.get(id);
    req.locals = { quizResult };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get quizResult
 * @public
 */
exports.get = (req, res) => res.json(req.locals.quizResult.transform());

/**
 * Get logged in quizResult info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.quizResult.transform());

/**
 * Create new quizResult
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const { user } = req;
    const quizResult = new QuizResult(req.body);
    // quizResult.quiz = req.quiz;
    quizResult.user = req.user._id;
    // quizResult.correctAnswersCount = req.correctAnswersCount;
    const savedQuizResult = await quizResult.save();
    res.status(httpStatus.CREATED);
    res.json(savedQuizResult.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing quizResult
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { quizResult } = req.locals;
    const newQuizResult = new QuizResult(req.body);
    const ommitRole = quizResult.role !== 'admin' ? 'role' : '';
    const newQuizResultObject = omit(newQuizResult.toObject(), '_id', ommitRole);

    await quizResult.update(newQuizResultObject, { override: true, upsert: true });
    const savedQuizResult = await QuizResult.findById(quizResult._id);

    res.json(savedQuizResult.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing quizResult
 * @public
 */
exports.update = (req, res, next) => {
  // const ommitRole = req.locals.quizResult.role !== 'admin' ? 'role' : '';
  const updatedQuizResult = omit(req.body);
  const quizResult = Object.assign(req.locals.quizResult, updatedQuizResult);

  quizResult.save()
    .then(savedQuizResult => res.json(savedQuizResult.transform()))
    .catch(e => next(e));
};

/**
 * Get quizResult list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const quizResultList = await QuizResult.list(req.query);
    const userId = req.user._id;
    const transformedQuizResult = quizResultList.map((quizResult) => {
      // quizResult.isRegistered = quizResult.users.includes(userId);
      return quizResult.transform();
    });
    res.json(transformedQuizResult);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete quizResult
 * @public
 */
exports.remove = (req, res, next) => {
  const { quizResult } = req.locals;

  quizResult.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};