exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
};

exports.getAllTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};
