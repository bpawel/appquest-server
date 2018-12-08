/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable object-curly-newline */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/class.controller');
const { authorize, ADMIN, LOGGED_USER, INSTRUCTOR, STUDENT } = require('../../middlewares/auth');
const {
  listClass,
  createClass,
  replaceClass,
  updateClass,
} = require('../../validations/class.validation');

const router = express.Router();

/**
 * Load class when API with classId route parameter is hit
 */
router.param('classId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/class List Class
   * @apiDescription Get a list of class
   * @apiVersion 1.0.0
   * @apiName ListClass
   * @apiGroup Class
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Class's access token
   *
   * @apiParam  {String}             [name]             Class's name
   * @apiParam  {String}             [description]      Class's description
   * @apiParam  {String}             [instructor]       Class's instructor
   *
   * @apiSuccess {Object[]} class List of class.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated classs can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize([ADMIN, INSTRUCTOR, STUDENT]), validate(listClass), controller.list)

  /**
   * @api {post} v1/class Create Class
   * @apiDescription Create a new class
   * @apiVersion 1.0.0
   * @apiName CreateClass
   * @apiGroup Class
   * @apiPermission admin instructor
   *
   * @apiHeader {String} Authorization   Users's access token
   *
   * @apiParam  {String}             [name]             Class's name
   * @apiParam  {String}             [description]      Class's description
   * @apiParam  {String}             [instructor]       Class's instructor
   *
   * @apiSuccess (Created 201) {String}  id         Class's id
   * @apiSuccess (Created 201) {String}  name       Class's name
   * @apiSuccess (Created 201) {String}  description     Class's description
   * @apiSuccess (Created 201) {String}  instructor Class's instructor
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated classs can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(authorize([ADMIN, INSTRUCTOR, STUDENT]), validate(createClass), controller.create);


router
  .route('/:classId')
  /**
   * @api {get} v1/class/:id Get Class
   * @apiDescription Get class information
   * @apiVersion 1.0.0
   * @apiName GetClass
   * @apiGroup Class
   * @apiPermission class
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {String}  id         Class's id
   * @apiSuccess {String}  name       Class's name
   * @apiSuccess {String}  description     Class's description
   * @apiSuccess {String}  instructor Class's instructor
   * @apiSuccess {Object[]}  list Class's users
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated classs can access the data
   * @apiError (Forbidden 403)    Forbidden    Only class with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Class does not exist
   */
  .get(authorize([ADMIN, INSTRUCTOR, STUDENT]), controller.get)
  /**
   * @api {put} v1/class/:id Replace Class
   * @apiDescription Replace the whole class document with a new one
   * @apiVersion 1.0.0
   * @apiName ReplaceClass
   * @apiGroup Class
   * @apiPermission class
   *
   * @apiHeader {String} Authorization   Class's access token
   *
   * @apiSuccess {String}  id         Class's id
   * @apiSuccess {String}  name       Class's name
   * @apiSuccess {String}  description     Class's description
   * @apiSuccess {String}  instructor Class's instructor
   *
   * @apiSuccess {String}  id         Class's id
   * @apiSuccess {String}  name       Class's name
   * @apiSuccess {String}  description     Class's description
   * @apiSuccess {String}  instructor Class's instructor
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated classs can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only class with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Class does not exist
   */
  .put(authorize([ADMIN, INSTRUCTOR, STUDENT]), validate(replaceClass), controller.replace)
  /**
   * @api {patch} v1/class/:id Update
   * @apiDescription Update some fields of a class document
   * @apiVersion 1.0.0
   * @apiName UpdateClass
   * @apiGroup Class
   * @apiPermission class
   *
   * @apiHeader {String} Authorization   Class's access token
   *
   * @apiSuccess {String}  id         Class's id
   * @apiSuccess {String}  name       Class's name
   * @apiSuccess {String}  description     Class's description
   * @apiSuccess {String}  instructor Class's instructor
   *
   * @apiSuccess {String}  id         Class's id
   * @apiSuccess {String}  name       Class's name
   * @apiSuccess {String}  description     Class's description
   * @apiSuccess {String}  instructor Class's instructor
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated classs can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only class with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Class does not exist
   */
  .patch(authorize([ADMIN, INSTRUCTOR]), validate(updateClass), controller.update)
  /**
   * @api {patch} v1/class/:id Delete Class
   * @apiDescription Delete a class
   * @apiVersion 1.0.0
   * @apiName DeleteClass
   * @apiGroup Class
   * @apiPermission class
   *
   * @apiHeader {String} Authorization   Class's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated classs can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only class with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Class does not exist
   */
  .delete(authorize([ADMIN, INSTRUCTOR]), controller.remove);


module.exports = router;
