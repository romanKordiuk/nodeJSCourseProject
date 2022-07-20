const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const mongoose = require('mongoose');
const e = require("express");

const mainRouter = require('./routes/index');

// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/api/users', mainRouter);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Config
mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    () => console.log("Connected to MongoDB"));


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
