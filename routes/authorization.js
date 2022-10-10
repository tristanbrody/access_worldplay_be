var express = require("express");
var router = new express.Router();
const axios = require("axios");
// const viewEngine = require('express-json-views');

const { v4: uuid } = require("uuid");
const { sequelize, Order, Payment, Customer } = require("../Models.js");
// const getDbClient = async () => {
//   return db.pool.connect();
// };
const app = express();
// express.engine('json', viewEngine({
//   helpers: require('./views/helpers')
// }))

const config = {
  headers: {
    Authorization: `Basic ${process.env.BASIC_AUTH_STRING}`,
    "Content-Type": "application/vnd.worldpay.payments-v6+json",
    Accept: "application/json",
  },
};

router.get("/", async function (req, res, next) {
  // query the root resource
  const rootResource = await axios.get(
    "https://try.access.worldpay.com/",
    config
  );
  console.log(rootResource.data);
  return res.json(rootResource.data);
});

router.post("/", async function (req, res, next) {
  const randomOrderCode = uuid();
  const sampleAuthorizationRequest = JSON.stringify({
    transactionReference: randomOrderCode,
    merchant: {
      entity: req.body.entity,
    },
    instruction: {
      narrative: {
        line1: "Mind Palace",
      },
      value: {
        currency: "GBP",
        amount: 250,
      },
      paymentInstrument: {
        type: "card/plain",
        cardNumber: req.body.cardNumber,
        cardHolderName: `${req.body.firstName} ${req.body.lastName}`,
        cvc: req.body.cvc,
        cardExpiryDate: {
          month: req.body.expirationMonth,
          year: req.body.expirationYear,
        },
      },
    },
  });
  const authorizationResponse = await axios.post(
    "https://try.access.worldpay.com/payments/authorizations",
    sampleAuthorizationRequest,
    config
  );
  const newOrder = await Order.create({
    orderCode: randomOrderCode,
  });

  console.dir(newOrder.dataValues.id);

  const newPayment = await Payment.create({
    amount: 250,
    status: authorizationResponse.data.outcome,
    OrderId: newOrder.dataValues.id,
  });

  res.send({
    res: authorizationResponse.data,
    newOrderCode: randomOrderCode,
  });
});

module.exports = router;
