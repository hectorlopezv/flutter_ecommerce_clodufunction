const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.testkey);
const generateResponse = function (intent) {
  switch (intent.status) {
    case "requires_action":
      return {
        requires_action: true,
        clientSecret: intent.client_secret,
        requiresAction: true,
      };
    case "requires_payment_method":
      return {
        error: "your card was denid, please privede a new payment method",
      };
    case "succeeded":
      console.log("payment suceededd");
      return {
        clientSecret: intent.client_secret,
        status: intent.status,
      };
  }
};
exports.StripePayEndPointMethodId = functions.https.onRequest(
  async (request, response) => {
    const { paymentMethodId, currency, useStripeSdk, amount } = request.body;

    try {
      if (paymentMethodId) {
        const params = {
          amount: amount,
          confirm: true,
          confirmation_method: "manual",
          currency: currency,
          payment_method: paymentMethodId,
          use_stripe_sdk: useStripeSdk,
        };
        const intent = await stripe.paymentIntents.create(params);
        console.log(`intent: ${intent}`);
        return response.send(generateResponse(intent));
      }
      return response.status(400).send("Missing paymentMethodId");
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  }
);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
