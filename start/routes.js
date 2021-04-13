'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');



Route.group(() => {
  //TRANSACTIONS
  Route.post('/transactions', 'TransactionController.store')
    .middleware('auth');
  Route.post('/transactions/list-by-filters', 'TransactionController.listByFilters')
    .middleware('auth');

  Route.post('/transactions/get-transaction-month-by-filters', 'TransactionController.getTransactionMonthByFilters')
    .middleware('auth');

  Route.post('/login', 'SessionController.create');
  Route.post('/users', 'UserController.create');
}).prefix('api/v1');




