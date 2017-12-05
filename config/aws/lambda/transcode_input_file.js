"use strict";
/*
  About:

  This lambda function is triggered when a file is added to our input bucket. The function is designed
  to do the following:
    1. Trigger an elastic transcoder pipeline in order to transcode our input file to 720p mp4 and
       720p webm.
    2. (Not handled here) Completion of this transcoding process triggers an SNS that triggers another
       lambda function. See cleanup_input_file_lambda.js in app codebase.
*/


var AWS = require("aws-sdk");

var s3 = new AWS.S3();

var eltr = new AWS.ElasticTranscoder({
  region : "us-east-1"
});

exports.handler = function(event, context) {
  console.log("Executing Elastic Transcoder");

  var bucket = event.Records[0].s3.bucket.name,
      key = event.Records[0].s3.object.key,
      pipelineId = "1234567890123-abcdef"; // Replace with your pipeline id

  var srcKey = decodeURIComponent(key.replace(/\+/g, " ")), // the object may have spaces
      newKey = key.split(".")[0],
      originalExtension = key.split(".")[1],
      eltrParams = {
        PipelineId : pipelineId,
        OutputKeyPrefix : newKey + "/",
        Input : {
          Key : srcKey,
          FrameRate : "auto",
          Resolution : "auto",
          AspectRatio : "auto",
          Interlaced : "auto",
          Container : "auto"
        },
        Outputs : [
          {
            Key : "mp4-" + newKey + ".mp4",
            PresetId : "1351620000001-000010" // Generic 720p
          },
          {
            Key : "webm-" + newKey + ".webm",
            PresetId : "1351620000001-100240" // Webm 720p
          }
        ]
      };

  console.log("Starting Job");

  eltr.createJob(eltrParams, function(err, data) {
    if (err) {
      console.log("Error running transcode pipeline with id '" + pipelineId + " for input key '" + newKey + "'");
      console.log(err, err.stack); // an error occurred
      context.fail();
      return;
    }

    context.succeed("Elastic Transcoder Completed");
  });
};
