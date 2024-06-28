const express = require('express');
const connectDB = require('./src/database/connection');
const expressApp = require('./src/express-app');
const app = express();

require('dotenv').config();

const port = process.env.PORT;
const start = async () => {
    try {
        await expressApp(app);
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`running on ${port}`))
    } catch (err) {
        console.log(err);
    }
}

start();
