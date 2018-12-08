/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { omit } = require('lodash');
const Class = require('../models/class.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const class_ = await Class.get(id);
    req.locals = { class_ };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get class
 * @public
 */
exports.get = (req, res) => res.json(req.locals.class_.transform());

/**
 * Get logged in class info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.class_.transform());


/**
 * Create new class
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const { user } = req;
    const class_ = new Class(req.body);
    class_.instructor = user._id; 
    const savedClass = await class_.save();
    res.status(httpStatus.CREATED);
    res.json(savedClass.transform()); 
  } catch (error) {
    next(error);
  }
};

/**
 * Replace existing class
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { class_ } = req.locals;
    const newClass = new Class(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newClassObject = omit(newClass.toObject(), '_id', ommitRole);

    await class_.update(newClassObject, { override: true, upsert: true });
    const savedClass = await Class.findById(class_._id);

    res.json(savedClass.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing class
 * @public
 */
exports.update = (req, res, next) => {
  // const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedClass = omit(req.body);
  const class_ = Object.assign(req.locals.user, updatedClass);

  class_.save()
    .then(savedClass => res.json(savedClass.transform()))
    .catch(e => next(e));
};

/**
 * Get class list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const classList = await Class.list(req.query);
    const userId = req.user._id;
    const transformedClass = classList.map((clas) => {
      clas.isRegistered = clas.users.includes(userId);
      return clas.transform();
    });
    res.json(transformedClass);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete class_
 * @public 
 */
exports.remove = (req, res, next) => {
  const { class_ } = req.locals;

  class_.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
