/* 
 * database models for the users collection
 * and the workouts collection
 */
const shortid = require('shortid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  user_name: {
    type: String,
    required: true,
    unique: true
  }
})

const workoutSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: Date
})

const User = mongoose.model('User', userSchema);
const Workout = mongoose.model('Workout', workoutSchema);

module.exports.User = User;
module.exports.Workout = Workout;