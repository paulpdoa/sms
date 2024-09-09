require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const registrarRoute = require('./routes/registrarRoute');
const masterRoute = require('./routes/masterRoute');
const schoolAdminRoute = require('./routes/schoolAdminRoute');
const teacherRoute = require('./routes/teacherRoute');
const studentRoute = require('./routes/studentRoute');
const parentRoute = require('./routes/parentRoute');
const financeRoute = require('./routes/financeRoute');

const uri = process.env.DB_URI;

const port = process.env.PORT;

app.listen(port, async () => {
    try {
        await mongoose.connect(uri);
        console.log(`Listening to port ${port} and connected to database successfully`);
    } catch(err) {
        console.log(err);
    }  
})

// Use
app.use(cors());
app.use(express.json());
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/api/',registrarRoute);
app.use('/api/',masterRoute);
app.use('/api/',schoolAdminRoute);
app.use('/api', teacherRoute);
app.use('/api',studentRoute);
app.use('/api',parentRoute);
app.use('/api',financeRoute);