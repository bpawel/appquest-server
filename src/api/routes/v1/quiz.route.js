/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-unresolved */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/quiz.controller');
const { authorize, ADMIN, STUDENT, INSTRUCTOR, LOGGED_USER } = require('../../middlewares/auth');
const {
  listQuiz,
  createQuiz,
  replaceQuiz,
  updateQuiz,
} = require('../../validations/quiz.validation');

const router = express.Router();

/**
 * Load quiz when API with quizId route parameter is hit
 */
router.param('quizId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/quiz List Quiz
   * @apiDescription Get a list of quiz
   * @apiVersion 1.0.0
   * @apiName ListQuiz
   * @apiGroup Quiz
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Quiz's access token
   *
   * @apiParam  {String}             [name]             Quiz's name
   * @apiParam  {String}             [type]      Quiz's type  
   * @apiParam  {String}             [instructor]       Quiz's instructor
   *
   * @apiSuccess {Object[]} quiz List of quiz.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated quizs can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([ADMIN, INSTRUCTOR, STUDENT]), validate(listQuiz), controller.list)
  /**
   * @api {post} v1/quiz Create Quiz
   * @apiDescription Create a new quiz
   * @apiVersion 1.0.0
   * @apiName CreateQuiz
   * @apiGroup Quiz
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Quiz's access token
   *
   * @apiParam  {String}             [name]             Quiz's name
   * @apiParam  {String}             [type]      Quiz's type  
   * @apiParam  {String}             [instructor]       Quiz's instructor
   *
   * @apiSuccess (Created 201) {String}  id         Quiz's id
   * @apiSuccess (Created 201) {String}  name       Quiz's name
   * @apiSuccess (Created 201) {String}  type     Quiz's type
   * @apiSuccess (Created 201) {String}  instructor Quiz's instructor
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated quizs can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize([ADMIN, INSTRUCTOR]), validate(createQuiz), controller.create);

router
  .route('/:quizId')
  /**
   * @api {get} v1/quiz/:id Get Quiz
   * @apiDescription Get quiz information
   * @apiVersion 1.0.0
   * @apiName GetQuiz
   * @apiGroup Quiz
   * @apiPermission quiz
   *
   * @apiHeader {String} Authorization   Quiz's access token
   *
   * @apiSuccess {String}  id         Quiz's id
   * @apiSuccess {String}  name       Quiz's name
   * @apiSuccess {String}  type     Quiz's type
   * @apiSuccess {String}  instructor Quiz's instructor
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated quizs can access the data
   * @apiError (Forbidden 403)    Forbidden    Only quiz with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Quiz does not exist
   */
  .get(authorize([ADMIN, INSTRUCTOR]), controller.get)
  /**
   * @api {put} v1/quiz/:id Replace Quiz
   * @apiDescription Replace the whole quiz document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceQuiz
   * @apiGroup Quiz
   * @apiPermission quiz
   *
   * @apiHeader {String} Authorization   Quiz's access token
   *
   * @apiSuccess {String}  id         Quiz's id
   * @apiSuccess {String}  name       Quiz's name
   * @apiSuccess {String}  type     Quiz's type
   * @apiSuccess {String}  instructor Quiz's instructor
   *
   * @apiSuccess {String}  id         Quiz's id
   * @apiSuccess {String}  name       Quiz's name
   * @apiSuccess {String}  type     Quiz's type
   * @apiSuccess {String}  instructor Quiz's instructor
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated quizs can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only quiz with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Quiz does not exist
   */
  .put(authorize([ADMIN, INSTRUCTOR]), validate(replaceQuiz), controller.replace)
  /**
   * @api {patch} v1/quiz/:id Update 
   * @apiDescription Update some fields of a quiz document
   * @apiVersion 1.0.0
   * @apiName UpdateQuiz
   * @apiGroup Quiz
   * @apiPermission quiz
   *
   * @apiHeader {String} Authorization   Quiz's access token
   *
   * @apiSuccess {String}  id         Quiz's id
   * @apiSuccess {String}  name       Quiz's name
   * @apiSuccess {String}  type     Quiz's type
   * @apiSuccess {String}  instructor Quiz's instructor
   *
   * @apiSuccess {String}  id         Quiz's id
   * @apiSuccess {String}  name       Quiz's name
   * @apiSuccess {String}  type     Quiz's type
   * @apiSuccess {String}  instructor Quiz's instructor
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated quizs can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only quiz with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Quiz does not exist
   */
  .patch(authorize([ADMIN, INSTRUCTOR]), validate(updateQuiz), controller.update)
  /**
   * @api {patch} v1/quiz/:id Delete Quiz
   * @apiDescription Delete a quiz
   * @apiVersion 1.0.0
   * @apiName DeleteQuiz
   * @apiGroup Quiz
   * @apiPermission quiz
   *
   * @apiHeader {String} Authorization   Quiz's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated quizs can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only quiz with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Quiz does not exist
   */
  .delete(authorize([ADMIN, INSTRUCTOR]), controller.remove);


module.exports = router;
