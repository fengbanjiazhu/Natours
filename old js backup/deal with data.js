const Tour = require('../models/tourModel');

exports.getAllTour = async (req, res) => {
  try {
    // model.find()
    let tours = await Tour.find({});
    // response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    // error
    res.status(404).json({
      status: 'fail',
      message: 'fail to get data',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // =  Tour.findOne({ _id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    // 略
  }
};

exports.createTour = async (req, res) => {
  try {
    // returns a promise
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    // 略
  }
};

exports.updateTour = async (req, res) => {
  try {
    // req.params.id
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // check data types
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    // 略
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    // 略
  }
};
