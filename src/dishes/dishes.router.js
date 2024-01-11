const router = require("express").Router();
const controller = require('./dishes.controller.js');
const methodNotAllowed = require('../errors/methodNotAllowed.js');

// Routes
router.route('/')
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);
router.route('/:dishId')
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);
module.exports = router;
