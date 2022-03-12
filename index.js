require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use("/api/v1/user", userRoutes);
app.use('/uploads/profile_picture', express.static('uploads/profile_picture'));
app.listen(3000, () => {
   console.log('server run di port ');
});