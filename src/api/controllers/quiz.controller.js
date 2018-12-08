/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-unresolved */
const httpStatus = require('http-status');
const { omit } = require('lodash');
const Quiz = require('../models/quiz.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load quiz and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const quiz = await Quiz.get(id);
    req.locals = { quiz };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get quiz
 * @public
 */
exports.get = (req, res) => res.json(req.locals.quiz.transform());

/**
 * Get logged in quiz info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.quiz.transform());

/**
 * Create new quiz
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const { user } = req;
    const quiz = new Quiz(req.body);
    quiz.instructor = user._id;
    const savedQuiz = await quiz.save();
    res.status(httpStatus.CREATED);
    res.json(savedQuiz.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing quiz
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { quiz } = req.locals;
    const newQuiz = new Quiz(req.body);
    const ommitRole = quiz.role !== 'admin' ? 'role' : '';
    const newQuizObject = omit(newQuiz.toObject(), '_id', ommitRole);

    await quiz.update(newQuizObject, { override: true, upsert: true });
    const savedQuiz = await Quiz.findById(quiz._id);

    res.json(savedQuiz.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing quiz
 * @public
 */
exports.update = (req, res, next) => {
  // const ommitRole = req.locals.quiz.role !== 'admin' ? 'role' : '';
  const updatedQuiz = omit(req.body);
  const quiz = Object.assign(req.locals.quiz, updatedQuiz);

  quiz.save()
    .then(savedQuiz => res.json(savedQuiz.transform()))
    .catch(e => next(e));
};

/**
 * Get quiz list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const quizList = await Quiz.list(req.query);
    const userId = req.user._id;
    const transformedQuiz = quizList.map((quiz) => {
      quiz.isRegistered = quiz.users.includes(userId);
      return quiz.transform();
    });
    res.json(transformedQuiz);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete quiz
 * @public
 */
exports.remove = (req, res, next) => {
  const { quiz } = req.locals;

  quiz.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};