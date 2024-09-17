const express = require('express');
const { get_finance_dashboard, get_finance_payment_schedule, get_finance_account_payments } = require('../controller/financeController');
const route = express.Router();
const { allowUserView } = require('../middleware/middlewares');

const userRole = ['Finance'];

// Dashboard
route.get('/finance-dashboard/:userId',allowUserView(userRole),get_finance_dashboard);
// Statement Of Accounts
route.get('/finance-payment-schedule/:userId',allowUserView(userRole),get_finance_payment_schedule);

// Account payments
route.get('/finance-account-payment/:userId', get_finance_account_payments);

module.exports = route;