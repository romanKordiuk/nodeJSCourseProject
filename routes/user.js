const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user');

router.post('/', user_controller.create_user);

router.get('/', user_controller.get_users);


module.exports = router;