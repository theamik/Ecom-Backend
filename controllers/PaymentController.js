const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Order = require('../models/orderModel');
const stripe = require('stripe')(
  'sk_test_51NfLjISHOxv3pnMQ5fKQ7R7N4KmCJurv3puRYZWsKVvNiJZ8wsdyWzFctuWocYHC5eSJXMoGjn6kzDo7rLVbG8qE00iZGEpwAH'
);

exports.createCheckoutSession = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.body.orderId });

  if (!order) {
    return next(new ErrorHandler('No order found with this ID', 404));
  }

  const items = order.orderItems.map((product) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: product.price * 100,
        currency: 'usd',
      },
      quantity: product.quantity,
    };
  });

  // success_url: `${req.protocol}://${req.get('host')}/success`,
  //   cancel_url: `${req.protocol}://${req.get('host')}/order/${order._id}`,

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    success_url: `${process.env.FRONTEND_URL}/checkout/success`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout/fail/${order._id}`,
    metadata: {
      orderId: order._id,
    },
    mode: 'payment',
    client_reference_id: order._id,
    customer_email: order.user.email,
  });

  res.status(200).json({
    success: true,
    url: stripeSession.url,
  });
});
