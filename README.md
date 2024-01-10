# Project_GrubDash
Server for saving orders and dishes for the fake GrubDash application

## Build
Run `npm install`, then `npm start` to test the server

## Test
Jest tests run with `npm test`

## Routes

### /orders
GET a list of orders, or POST a new order

### /orders/:orderId
GET a single order, PUT updates to the existing order, or DELETE an exiting pending order

### /dishes
GET a list of dishes, or POST a new dish

### /dishes/:dishId
GET a single dish, or PUT updates to the existing dish

