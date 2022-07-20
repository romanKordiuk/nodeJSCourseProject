const router = require('express').Router();

const user = require('./user');
const exercise_controller = require("../controllers/exercise");

router.use('/', user);

router.post('/:_id/exercises', exercise_controller.add_exercise);

router.get('/:_id/logs', exercise_controller.get_logs);


module.exports = router;