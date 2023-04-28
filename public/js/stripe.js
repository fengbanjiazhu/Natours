const stripe = Stripe(
  'pk_test_51N1PBAIq5PvrzIVYO5l0JOUPBovheTfXjrwNCMtBfOVsHd0tKrTWZcvSwZzBldttQuTXrzEIUddZRyQSa1EXiD8s00iQ8im3UH'
);

export const bookTour = async (tourId) => {
  // get checkout session from api
  const session = await fetch(
    `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
  );

  console.log(session);
  // create checkout form + charge credit card
};
