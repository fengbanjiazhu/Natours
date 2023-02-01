const express = require('express');
const {
  getAllTour,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
} = require('../controllers/tourController');

const router = express.Router();

// added a middle ware before we reach getAllTour()
// this middle ware -- aliasTopTours()
// pre-set some query options in
// help us with find top rating and sort by price
// then uses getAllTour() with the query to get result
router.route('/top-5-cheap').get(aliasTopTours, getAllTour);

router.route('/').get(getAllTour).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
