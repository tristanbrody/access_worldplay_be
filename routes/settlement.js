const express = require("express");
const settlementRouter = new express.Router();
const axios = require("axios");

const config = {
  headers: {
    Authorization: `Basic ${process.env.BASIC_AUTH_STRING}`,
    "Content-Type": "application/vnd.worldpay.payments-v6+json",
    Accept: "application/json",
  },
};

settlementRouter.post("/", async (req, res, next) => {
  //ensure that settlement href was passed in by client
  const settlementHref = req.body.settlementHref || "";
  if (settlementHref === "") {
    res.status(400).json({ error: "Missing settlement href" });
  }
  const resp = await axios.post(settlementHref, {}, config);
  res.send(resp);
});

module.exports = settlementRouter;
