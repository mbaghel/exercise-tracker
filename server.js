require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const dbModels = require('./dbModels');
const User = dbModels.User;
const Workout = dbModels.Workout;

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track', {
  useMongoClient: true
} )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Adding a new user
app.post('/api/exercise/new-user', (req, res, next) => {
  let newUser = req.body.username;
  if (typeof newUser != 'string') {
    res.send('something went wrong')
  }
  newUser = newUser.trim();

  const query = User.findOne({ user_name: newUser });

  query.then((user) => {
    if (user) {
      return res.send('Username already taken!');
    }

    const toAdd = new User({ user_name: newUser});
    const save = toAdd.save();
    save.then((doc) => {
      res.send(JSON.stringify({ 
        user_name: doc.user_name, 
        user_id: doc._id
      }));
    });
    save.catch((err) => {
      return next(err);
    });
  });
  query.catch((err) => {
    return next(err);
  });
});

// Adding a new exercise
app.post('/api/exercise/add', (req, res, next) => {
  const bodyObj = req.body;

  const query = User.where({_id: bodyObj.userId});
  query.findOne((err, user) => {

    if (err) {
      return next(err);
    }
    if (!user) {
      res.send('No such user!');
    }

    const date = bodyObj.date ? bodyObj.date : new Date();

    const toAdd = new Workout({
      user_id: bodyObj.userId,
      description: bodyObj.description,
      duration: bodyObj.duration,
      date: date 
    })
    toAdd.save((err, doc) => {
      if (err) {
        return next(err);
      }
      
      res.send(JSON.stringify({
        userId: doc.user_id,
        description: doc.description,
        duration: doc.duration,
        date: doc.date
      }));
    });
  });
});

// Getting user's exercise log
app.get('/api/exercise/log', (req, res, next) => {
  const { userId } = req.query;
  let limit;
  if (req.query.limit) {
    limit = parseInt(req.query.limit, 10);
  }
  const from = req.query.from || '1900-01-01';
  const to = req.query.to || '3000-12-31'; 

  userQuery = User.where({ _id: userId });
  userQuery.select({ __v: 0 });
  logQuery = Workout.where({ 
    user_id: userId,
    date: { $gte: from, $lte: to}
  });
  logQuery.select({_id: 0, user_id: 0, __v: 0});
  logQuery.limit(limit);

  userQuery.findOne((err, user) => {
    if (err) {
      return next(err);
    }

    logQuery.find((err, docs) => {
      if (err) {
        return next(err);
      }
      res.send(JSON.stringify({
        _id: user._id,
        username: user.user_name,
        count: docs.length,
        log: docs
      }));
    });
  });
});

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
