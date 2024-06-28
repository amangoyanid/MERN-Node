const express = require('express');
const connectDB = require('./database/connect');
const app = express();

const route = require('./api/mainRoute')

require('dotenv').config();

app.use(express.json());

app.use('/', route);

const port = process.env.PORT;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`running on ${port}`))
    } catch (err) {
        console.log(err);
    }
}

start();
