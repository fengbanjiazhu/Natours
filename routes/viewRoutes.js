const express = require('express');
const viewsController = require('../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getOverview);

router.get('/tour/:slug', viewsController.getTour);

router.get('/login', viewsController.loginView);

router.get('/signup', viewsController.signupView);

module.exports = router;
