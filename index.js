const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const mongoose = require('mongoose');
const {Schema} = mongoose;


// Schemas
const userSchema = new Schema({
  "username": String,
});

const exerciseSchema = new Schema({
  "username": String,
  "date": Date,
  "duration": Number,
  "description": String
});

const logSchema = new Schema({
  "username": String,
  "count": Number,
  "log": Array
});

// Models
const UserInfo = mongoose.model('userInfo', userSchema);
const ExerciseInfo = mongoose.model('exerciseInfo', exerciseSchema);
const LogInfo = mongoose.model('logInfo', logSchema);


// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// API Endpoints

  // #1
app.post('/api/users', (req, res) => {
  UserInfo.find({"username": req.body.username}, (err, userData) => {
    if (err) console.log(`Error with server ${err}`);
    else {
      if (userData.length === 0) {
        const test = new UserInfo({
          "_id": req.body.id,
          "username": req.body.username
        });

        test.save((err, data) => {
          if (err) console.log(`Error saving data=> ${err}`);
          else res.json({
            "_id": data.id,
            "username": data.username
          })
        });
      } else {
        res.send("Username already Exists");
      }
    }
  });
});

  // #2
app.post('/api/users/:_id/exercise', (req, res) => {
  let idJson = {'id': req.params._id};
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
