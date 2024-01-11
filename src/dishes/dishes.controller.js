const path = require("path");
const nextId = require("../utils/nextId");
const validateNewData = require("../utils/validateNewData.js");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Validation
// check if dish ID is valid
function checkDishExists(request, response, next) {
  const dishId = request.params.dishId;
  const dish = dishes.find(dish => dish.id == dishId);
  if (dish) {
    response.locals.dish = dish;
    return next();
  }
  next({
    status: 404,
    message: 'Dish not found: ' + dishId
  })
}
// check if data passed by request is valid
function checkNewDishValidity(request, response, next) {
  const expectedFields = ['name', 'description', 'price', 'image_url'];
  const { data, error } = validateNewData(request, next, expectedFields);
  if(data) {
    if (!Number.isInteger(data.price) || data.price <= 0) {
      return next({
        status: 400,
        message: `${request.method} request body to ${request.path} must include a >0 integer value for price`
      })
    }
    response.locals.newDish = data;
    next();
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
  response.status(200).json({ data: dishes });
}

function read(request, response, next) {
  response.status(200).json({ data: response.locals.dish });
}

function create(request, response, next) {
  const newDish = response.locals.newDish;
  newDish.id = nextId();
  dishes.push(newDish);
  response.status(201).json({ data: newDish });
}

function update(request, response, next) {
  const dish = response.locals.dish;
  const { id, name, description, price, image_url } = response.locals.newDish;
  if (id && id !== dish.id) return next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dish.id}`
  })
  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  response.status(200).json({ data: dish })
}

module.exports = {
  list: [list],
  read: [checkDishExists, read], 
  create: [checkNewDishValidity, create], 
  update: [checkDishExists, checkNewDishValidity, update], 
}
