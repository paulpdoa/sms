require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const registrarRoute = require('./routes/registrarRoute');
const masterRoute = require('./routes/masterRoute');
const schoolAdminRoute = require('./routes/schoolAdminRoute');

// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URI;


const port = process.env.PORT;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       deprecationErrors: true,
//     }
// });

// async function run() {

//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// app.listen(port,() => {
//     console.log('Server is connected to port 8080');
//     run().catch(console.dir);
// })
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

// Use routes
app.use('/api/',registrarRoute);
app.use('/api/',masterRoute);
app.use('/api/',schoolAdminRoute);