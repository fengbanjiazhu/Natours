const express = require('express');
const {
  getAllTour,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
} = require('../controllers/tourController');

const router = express.Router();

// data flow will go through middle wares
// and arrive here (tour routes)
// and if there is a /id/ value
// will go trough ↓ again
router.param('id', checkID);

// the data will go through checkID first,
// then deal with the controller

// chain a middle ware before response
router.route('/').get(getAllTour).post(checkBody, createTour);
// /api/v1/tours/:id/:x? -- ? will make x optional
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;

// instead of using these:
// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
