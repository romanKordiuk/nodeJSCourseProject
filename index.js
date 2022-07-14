const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

const mongoose = require('mongoose');
const e = require("express");
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
        UserInfo.find({}).then(function (users) {
          res.send(users);
        });
        // res.send("Username already Exists");
      }
    }
  });
});

  // #2
app.post('/api/users/:_id/exercises', (req, res) => {
  let idJson = {'id': req.params._id};
  let checkedDate = new Date(req.body.date);
  let idToCheck = idJson.id;

  let noDateHandler = () => {
    if (checkedDate instanceof Date && !isNaN(checkedDate)) {
      return checkedDate;
    } else checkedDate = new Date();
  }


  UserInfo.findById(idToCheck, (err, userData) => {
    noDateHandler();

    if (err) console.log("error with id =>", err);
    else {
      const test = new ExerciseInfo({
        "username": userData.username,
        "description": req.body.description,
        "duration": req.body.duration,
        "date": checkedDate.toDateString()
      });

      test.save((error, data) => {
        if (error) {
          console.log("error saving=>", error);
        } else {
          console.log('saved exercise successfully');
          res.json({
            "_id": idToCheck,
            "username": data.username,
            "description": data.description,
            "duration": data.duration,
            "date": data.date
          });
        }
      })
    }

  });
});


 // #3
app.get('/api/users/:_id/logs', (req, res) => {
  const {from, to, limit} = req.query;
  let idJson = {"id": req.params._id};
  let idToCheck = idJson.id;

  // Check ID

  UserInfo.findById(idToCheck, (err, data) => {
    var query = {
      username: data.username,
    };

    if (from !== undefined && to === undefined) {
      query.date = {$gte: new Date(from)};
    } else if (to !== undefined && from === undefined) {
      query.date = {$lte: new Date(to)};
    } else if (from !== undefined && to !== undefined) {
      query.date = {$gte: new Date(from), $lte: new Date(to)};
    }

    let limitChecker = (limit) => {
      let maxLimit = 100;
      if (limit) {
        return limit;
      } else {
        return maxLimit;
      }
    };

    if (err) {
      console.log("error with ID=> ", err);
    } else {
      ExerciseInfo.find((query), null, {limit: limitChecker(+limit)}, (error, exerciseData) => {
        let loggedArray = [];
        if (error) {
          console.log("error with query=> ", error);
        } else {
          let documents = exerciseData;
          loggedArray = documents.map(item => {
            return {
              description: item.description,
              duration: item.duration,
              date: item.date.toDateString()
            }
          });

          const test = new LogInfo({
            username: data.username,
            count: loggedArray.length,
            log: loggedArray
          });

          test.save((saveErr, saveData) => {
            if (saveErr) console.log("error saving exercise=> ", saveErr);
            else {
              console.log("saved exercise successfully");
              res.json({
                "_id": idToCheck,
                "username": data.username,
                "count": data.count,
                "log": loggedArray
              })
            }
          });
        }
      });
    }
  })
});

  // #4
app.get('/api/users', (req, res) => {
  UserInfo.find({}, (err, data) => {
    if (err) res.send("No Users");
    else res.json(data);
  });
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
