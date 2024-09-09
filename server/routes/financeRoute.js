const express = require('express');
const { get_finance_dashboard, get_finance_payment_schedule } = require('../controller/financeController');
const route = express.Router();
const { allowUserView } = require('../middleware/middlewares');

const userRole = ['Finance'];

// Dashboard
route.get('/finance-dashboard/:userId',allowUserView(userRole),get_finance_dashboard);
//Payment Schedule
route.get('/finance-payment-schedule/:userId',allowUserView(userRole),get_finance_payment_schedule);

module.exports = route;