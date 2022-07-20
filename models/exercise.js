const mongoose = require('mongoose');
const {Schema} = mongoose;

const ExerciseSchema = new Schema({
    "userId": {
        type: String,
        required: true
    },
    "exerciseId": String,
    "date": {
        type: Date,
        default: Date.now
    },
    "duration": {
        type: Number,
        required: true,
        min: [1, 'Duration too short, at least 1 minute']
    },
    "description": {
        type: String,
        required: true,
        maxlength: [25, 'Description too long, not greater than 25']
    }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);