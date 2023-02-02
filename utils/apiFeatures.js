class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // build query

    // 1A - filtering
    const queryObj = { ...this.queryString };
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

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    // 2 - Sorting
    if (this.queryString.sort) {
      //query: ?sort=-price,-ratingsAverage
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // pagination skip() function needs to sort by a unique value
      this.query = this.query.sort('-createdAt _id');
    }
    return this;
  }

  limitFields() {
    // 3- Fields limiting
    if (this.queryString.fields) {
      // query: { fields: 'name,duration,difficulty,price' }
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__V');
    }
    return this;
  }

  paginate() {
    // 4 - Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // skip() => skip how many results
    // if page 1 has 10 result, then page 2 should be 11 - 20
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
