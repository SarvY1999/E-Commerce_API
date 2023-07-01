const express = require('express');
require('express-async-errors');
const app = express();
require('dotenv').config();
const connectDB = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
app.use(express.json());

app.get('/', (req, res) => {
    res.send('E-Com Api')
})

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`listening on ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();

