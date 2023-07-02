const express = require('express');
require('express-async-errors');
const app = express();
require('dotenv').config();
const morgan = require('morgan');
const connectDB = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const authRouter = require('./routes/authRouter');

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('E-Com Api')
})
app.use('/api/v1/auth', authRouter);
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

