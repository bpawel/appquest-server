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
const controller = require('../../controllers/quiz-result.controller');
const { authorize, ADMIN, STUDENT, INSTRUCTOR, LOGGED_USER } = require('../../middlewares/auth');

const router = express.Router();

/**
 * Load quizResult when API with quizResultId route parameter is hit
 */
router.param('quizResultId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/quiz-result List QuizResult
   * @apiDescription Get a list of quizResult
   * @apiVersion 1.0.0
   * @apiName ListQuizResult
   * @apiGroup QuizResult
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   QuizResult's access token
   *
   * @apiParam  {String}             [name]             QuizResult's name
   * @apiParam  {String}             [type]      QuizResult's type  
   * @apiParam  {String}             [instructor]       QuizResult's instructor
   *
   * @apiSuccess {Object[]} quizResult List of quizResult.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated quizResults can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([ADMIN, INSTRUCTOR, STUDENT]), controller.list)
  /**
   * @api {post} v1/quiz-result Create QuizResult
   * @apiDescription Create a new quizResult
   * @apiVersion 1.0.0
   * @apiName CreateQuizResult
   * @apiGroup QuizResult
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   QuizResult's access token
   *
   * @apiParam  {String}             [name]             QuizResult's name
   * @apiParam  {String}             [type]      QuizResult's type  
   * @apiParam  {String}             [instructor]       QuizResult's instructor
   *
   * @apiSuccess (Created 201) {String}  id         QuizResult's id
   * @apiSuccess (Created 201) {String}  name       QuizResult's name
   * @apiSuccess (Created 201) {String}  type     QuizResult's type
   * @apiSuccess (Created 201) {String}  instructor QuizResult's instructor
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated quizResults can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize([ADMIN, INSTRUCTOR, STUDENT]), controller.create);

router
  .route('/:quizResultId')
  /**
   * @api {get} v1/quiz-result/:id Get QuizResult
   * @apiDescription Get quizResult information
   * @apiVersion 1.0.0
   * @apiName GetQuizResult
   * @apiGroup QuizResult
   * @apiPermission quizResult
   *
   * @apiHeader {String} Authorization   QuizResult's access token
   *
   * @apiSuccess {String}  id         QuizResult's id
   * @apiSuccess {String}  name       QuizResult's name
   * @apiSuccess {String}  type     QuizResult's type
   * @apiSuccess {String}  instructor QuizResult's instructor
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated quizResults can access the data
   * @apiError (Forbidden 403)    Forbidden    Only quizResult with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     QuizResult does not exist
   */
  .get(authorize([ADMIN, INSTRUCTOR, STUDENT]), controller.get)
  /**
   * @api {put} v1/quiz-result/:id Replace QuizResult
   * @apiDescription Replace the whole quizResult document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceQuizResult
   * @apiGroup QuizResult
   * @apiPermission quizResult
   *
   * @apiHeader {String} Authorization   QuizResult's access token
   *
   * @apiSuccess {String}  id         QuizResult's id
   * @apiSuccess {String}  name       QuizResult's name
   * @apiSuccess {String}  type     QuizResult's type
   * @apiSuccess {String}  instructor QuizResult's instructor
   *
   * @apiSuccess {String}  id         QuizResult's id
   * @apiSuccess {String}  name       QuizResult's name
   * @apiSuccess {String}  type     QuizResult's type
   * @apiSuccess {String}  instructor QuizResult's instructor
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated quizResults can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only quizResult with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     QuizResult does not exist
   */
  .put(authorize([ADMIN, INSTRUCTOR]), controller.replace)
  /**
   * @api {patch} v1/quiz-result/:id Update 
   * @apiDescription Update some fields of a quizResult document
   * @apiVersion 1.0.0
   * @apiName UpdateQuizResult
   * @apiGroup QuizResult
   * @apiPermission quizResult
   *
   * @apiHeader {String} Authorization   QuizResult's access token
   *
   * @apiSuccess {String}  id         QuizResult's id
   * @apiSuccess {String}  name       QuizResult's name
   * @apiSuccess {String}  type     QuizResult's type
   * @apiSuccess {String}  instructor QuizResult's instructor
   *
   * @apiSuccess {String}  id         QuizResult's id
   * @apiSuccess {String}  name       QuizResult's name
   * @apiSuccess {String}  type     QuizResult's type
   * @apiSuccess {String}  instructor QuizResult's instructor
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated quizResults can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only quizResult with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     QuizResult does not exist
   */
  .patch(authorize([ADMIN, INSTRUCTOR]), controller.update)
  /**
   * @api {patch} v1/quiz-result/:id Delete QuizResult
   * @apiDescription Delete a quizResult
   * @apiVersion 1.0.0
   * @apiName DeleteQuizResult
   * @apiGroup QuizResult
   * @apiPermission quizResult
   *
   * @apiHeader {String} Authorization   QuizResult's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated quizResults can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only quizResult with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      QuizResult does not exist
   */
  .delete(authorize([ADMIN, INSTRUCTOR]), controller.remove);


module.exports = router;
