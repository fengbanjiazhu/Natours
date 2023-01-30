const Tour = require('../models/tourModel');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fails',
      message: 'missing name or price',
    });
  }
  next();
};

exports.getAllTour = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'updated tour',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
