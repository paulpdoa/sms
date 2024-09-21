const express = require('express');
const { get_finance_dashboard, get_finance_payment_schedule, get_finance_account_payments, add_finance_payment, get_finance_payment_transactions, get_finance_payment_history } = require('../controller/financeController');
const route = express.Router();
const { allowUserView } = require('../middleware/middlewares');

const userRole = ['Finance'];

// Dashboard
route.get('/finance-dashboard/:userId',allowUserView(userRole),get_finance_dashboard);
// Statement Of Accounts
route.get('/finance-payment-schedule/:userId',allowUserView(userRole),get_finance_payment_schedule);

// Account payments
route.get('/finance-account-payment/:userId', get_finance_account_payments);

// Payments
route.post('/add-finance-payment', add_finance_payment);
route.get('/payment-transactions', get_finance_payment_transactions);

// Payment History page
route.get('/finance-payment-history/:userId', get_finance_payment_history);

module.exports = route;