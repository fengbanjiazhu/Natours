const express = require('express');
const {
  getAllTour,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require('../controllers/tourController');

const router = express.Router();

router.route('/').get(getAllTour).post(createTour);
// /api/v1/tours/:id/:x? -- ? will make x optional
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;

// instead of using these:
// app.get('/api/v1/tours', getAllTour);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
