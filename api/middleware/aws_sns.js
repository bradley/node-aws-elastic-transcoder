var https = require("https"),
    BodyParser = require("body-parser"),
    jsonParser = BodyParser.json(),
    MessageValidator = require("sns-validator"),
    validator = new MessageValidator();


function verifySNSNotification(req, res, next) {
  if (!req.body) {
    res.send(400);
    return;
  }

  // Validate that the request is coming from AWS.
  validator.validate(req.body, function (err, message) {
    if (err) {
      console.error(err);
      res.send(400);
      return;
    }

    if (message["Type"] === "Notification") {
      req.snsMessage = message;
      next();
      return;
    }

    if (message["Type"] === "SubscriptionConfirmation") {
      https.get(message["SubscribeURL"], function (res) {
        // Confirmed your endpoint subscription (required).
      });
    }

    if (message["Type"] === "UnsubscribeConfirmation") {
      https.get(message["SubscribeURL"], function (res) {
        // AWS action has unsubscribed your endpoint for SNS notifications.
      });
    }

    res.send(200);
  });
}


module.exports = {
  verifySNSNotification : verifySNSNotification
};
