const express = require('express');
require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const authRouter = require('./routes/authRouter');

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies);
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

