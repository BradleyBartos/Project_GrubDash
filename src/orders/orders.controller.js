const path = require("path");
const nextId = require("../utils/nextId");
const validateNewData = require("../utils/validateNewData.js");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Variable of statuses that are allowed in updates
const acceptedStatuses = ['pending', 'preparing', 'out-for-delivery', 'delivered'];

// Validation
// check if order ID is valid
function checkOrderExists(request, response, next) {
  const orderId = request.params.orderId;
  const order = orders.find(order => order.id == orderId);
  if (order) {
    response.locals.order = order;
    return next();
  }
  next({
    status: 404,
    message: 'Dish not found: ' + orderId
  })
}
// check if data passed by request is valid
function checkOrderValidity(request, response, next) {
  const expectedFields = ['deliverTo', 'mobileNumber', 'dishes'];
  const { data, error } = validateNewData(request, next, expectedFields);
  if(data) {
    // dishes special validation
    if (!data.dishes || data.dishes.length < 1) {
      return next({
        status: 400,
        message: `${request.method} request body to ${request.path} must include a non-empty array for dishes`
      })
    } 
    // quantity special validation
    for(let index in data.dishes) {
      if (
        !Number.isInteger(data.dishes[index].quantity) || 
        data.dishes[index].quantity <= 0
      ) {
        return next({
          status: 400,
          message: `In ${request.method} request to ${request.path}, ` +
            `dish ${index} must have a quantity that is an integer greater than 0`
        })
      }
    }
    response.locals.data = data;
    next();
  // handle errors
  } else if (error) {
    return next(error);
  } else {
    return next({
      status: 500,
      message: 'Unknown exception occurred during validation'
    })
  }
}

// Handlers
function list(request, response, next) {
  response.status(200).json({ data: orders });
}

function read(request, response, next) {
  response.status(200).json({ data: response.locals.order})
}

function create(request, response, next) {
  const data = response.locals.data;
  data.id = nextId();
  orders.push(data);

  response.status(201).json({ data })
}

function update(request, response, next) {
  // original
  const order = response.locals.order;
  if (order.status === 'delivered') {
    return next({
      status: 400,
      message: `A delivered order, ${order.id}, cannot be changed`
    })
  }
  // new
  const { id, deliverTo, mobileNumber, dishes, status } = response.locals.data;
  if (!status || !acceptedStatuses.includes(status)) {
    return next({
      status: 400,
      message: `Order must have a status of pending, preparing, out-for-delivery, or delivered`
    })
  } 
  if (id && id !== order.id) return next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${order.id}`
  })
  // update
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.dishes = dishes;
  order.status = status;
  // send
  response.status(200).json({ data: order })
}

function destroy(request, response, next) {
  const order = response.locals.order;
  if (order.status !== 'pending') {
    return next({
      status: 400,
      message: `The order, ${order.id}, cannot be deleted. The status must be pending, but is ${order.status}`
    })
  }
  orders.splice(orders.indexOf(order), 1);
  
  response.sendStatus(204)
}

module.exports = {
  list: [list],
  read: [checkOrderExists, read], 
  create: [checkOrderValidity, create], 
  update: [checkOrderExists, checkOrderValidity, update], 
  delete: [checkOrderExists, destroy],
}
