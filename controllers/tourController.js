const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.getAllTour = async (req, res) => {
  try {
    console.log(req.query);
    // build query

    // 1A - filtering
    const queryObj = { ...req.query };
    // query: { difficulty: 'easy', page: '23', limit: '10' }
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // remove page, sort, limit, fields from the query:
    // { difficulty: 'easy' }
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1B - ADVANCED filtering
    let queryStr = JSON.stringify(queryObj);
    // query: ?duration[gte]=5&price[lt]=500
    // which is : { duration: { 'gte': '5' }, price: { 'lt': '500' } }

    // we make it:
    // { duration: { '$gte': '5' }, price: { '$lt': '500' } }
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2 - Sorting
    if (req.query.sort) {
      //query: ?sort=-price,-ratingsAverage
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // pagination skip() function needs to sort by a unique value
      query = query.sort('-createdAt _id');
    }

    // 3- Fields limiting
    if (req.query.fields) {
      // query: { fields: 'name,duration,difficulty,price' }
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__V');
    }

    // 4 - Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // skip() => skip how many results
    // if page 1 has 10 result, then page 2 should be 11 - 20
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // execute query
    let tours = await query;

    // send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
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
    res.status(404).json({
      status: 'fail',
      message: 'fail to get data',
    });
  }
};

exports.createTour = async (req, res) => {
  // use try...catch... because of async await
  try {
    // before we use:
    // const newTour = new Tour({data});
    // newTour.save()

    // now we just use Tour.create()
    // returns a promise
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
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
    res.status(404).json({
      status: 'fail',
      message: 'fail to get data',
    });
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
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
