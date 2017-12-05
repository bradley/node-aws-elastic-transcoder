var path = require("path"),
    Sequelize = require("sequelize"),
    snsMiddleware = require(path.resolve("api/middleware")).aws_sns,
    verifySNSNotification = snsMiddleware.verifySNSNotification,
    TokenVendingMachine = require(path.resolve("api/services/aws/token_vending_machine"));


// Actions ======================================================================
function create(req, res, next) {
  var models = req.app.get("models"),
      userId = req.user.id;

  models.StoryJob.create({
    userId : userId
  })
  .then(function(storyJob) {
    var tokenVendingMachine = new TokenVendingMachine();

    tokenVendingMachine.getStoryCreationAccessCredentials()
    .then(function (credentials) {

      return res.send(200, {
        storyJob : {
          referenceId : storyJob.referenceId
        },
        aws : {
          credentials : credentials
        }
      });
    })
    .catch(function (err) {
      console.log("Unable to fetch bucket access credentials for StoryJob id '" + storyJob.id + "'");
      console.log(err);
      return res.send(500, { status : 500, message : "Unable to fetch bucket access credentials." });
    });
  })
  .catch(Sequelize.ValidationError, function (err) {
    var error = err.errors[0],
        message = error ? error.message : "Invalid parameters."

    return res.send(422, { message : message });
  }).catch(function(err) {
    next(err);
  });
};

function awsStoryUploadCompleteWebhook(req, res, next) {
  var models = req.app.get("models"),
      message = JSON.parse(req.snsMessage.Message),
      referenceId = message.referenceId;

  models.StoryJob.findOne({
    where : { $and : [ { referenceId : referenceId }, { active : true } ] }
  })
  .then(function(storyJob) {
    if (!storyJob) {
      var err = new Error("Failed to find active StoryJob object with referenceId: " + referenceId);
      throw(err);
    }

    return storyJob.update({
      active : false,
      rawResponse : req.snsMessage.Message,
      responseState : message.state,
      responseReceivedAt : new Date()
    });
  })
  .then(function(storyJob) {
    if (storyJob.responseState == "COMPLETED") {

      return models.sequelize.transaction({ autocommit : false }, function (t) {

        // Create new primaryStory for user.
        return models.Story.create({
          outputKeyPrefix : referenceId,
          userId : storyJob.userId,
          storyJobId : storyJob.id
        }, { transaction : t })
        .then(function (story) {
          // Keep promises for non-chained transactions. Will commit at end.
          var promises = [];

          // Create storyMedia objects for story.
          for (var i = 0; i < message.outputs.length; i++) {
            var output = message.outputs[i],
                promise = models.StoryMedia.create({
                  key : output.key,
                  width : output.width,
                  height : output.height,
                  duration : output.duration,
                  url : story.urlForMediaWithKey(output.key),
                  storyId : story.id
                }, { transaction : t });

            promises.push(promise);
          };

          // Commit promises.
          return Promise.all(promises);
        });
      })
      .then(function (result) {
        console.log("Story creation complete for referenceId: '" + storyJob.referenceId + "'");
        res.send(200);
      });
    } else {
      res.send(200);
    }
  }).catch(function(err) {
    console.log("Error encountered processing awsStoryUploadCompleteWebhook:");
    console.log(err);
    return res.send(200); // AWS doesn't need to know of error at this point. It was a successful request.
  });
}


// Exports ======================================================================
module.exports = function(app, passport) {
  app.post("/api/v1/story_jobs", passport.authenticate("authenticate-JWT"), create);
  app.post("/api/v1/story_jobs/aws_story_upload_complete_webhook", verifySNSNotification, awsStoryUploadCompleteWebhook);
}
