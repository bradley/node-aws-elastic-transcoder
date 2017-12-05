"use strict";
/*
  About:

  This lambda function is triggered via SNS after our transcode process (triggered by another lambda
  function) has completed. This function is designed to do the following:
    1. Receive the SNS payload from the transcode job that includes information such as the pipeline
       used for the transcode, as well as important information about each transcoded file.
    2. Read from the pipeline from the transcode job to asertain the input and output bucket the
       transcode used.
    3. Read the head information from the original file uploaded to the input bucket prior to transcode
       in order to get important information about the file without loading it, itself, into memory.
    4. Rename and Copy the original file to the output bucket.
    5. Delete the original file from the input bucket.
    6. Send SNS with payload information regarding the original file's reference Id (used to find the
       StoryJob on the server for this file) and all output files now in the output bucket.

  NOTE:
  At the time of this writing (28/06/2017) this file is a bit messy in terms of callback chaining. I
  am not going to remedy this now, but will leave comments pertaining to the steps outlined above.

*/

var AWS = require("aws-sdk");

var s3 = new AWS.S3();

var sns = new AWS.SNS();

var eltr = new AWS.ElasticTranscoder({
  region : "us-east-1"
});

exports.handler = function(event, context) {

  /*
  1. Receive the SNS payload from the transcode job that includes information such as the pipeline
       used for the transcode, as well as important information about each transcoded file.
  */

  var payload = JSON.parse(event.Records[0].Sns.Message),
      pipelineId = payload.pipelineId,
      inputKey = payload.input.key,
      outputKeyPrefix = payload.outputKeyPrefix;

  var inputFileNameWithoutExtension = inputKey.split(".")[0],
      extension = inputKey.split(".")[1];

  var outputs = payload.outputs.map(function (output) {
    return {
      key : output.key,
      type : output.key.split(".")[1],
      duration : output.duration,
      width : output.width,
      height : output.height
    };
  });


  /*
  2. Read from the pipeline from the transcode job to asertain the input and output bucket the
       transcode used.
  */

  eltr.readPipeline({
    Id : pipelineId
  }, function(err, data) {
    if (err) {
      console.log("Error reading pipeline with id '" + pipelineId + "'");
      console.log(err, err.stack);
      context.fail();
      return;
    }

    var inputBucket = data.Pipeline.InputBucket,
        outputBucket = data.Pipeline.OutputBucket || data.Pipeline.ContentConfig.Bucket; // For some reason AWS stores OutputBucket in different locations depending on how it was created (web UI vs API I think).


    /*
    3. Read the head information from the original file uploaded to the input bucket prior to transcode
       in order to get important information about the file without loading it, itself, into memory.
    */
    s3.headObject({
      Bucket : inputBucket,
      Key : inputKey
    }, function(err, data) {
      if (err) {
        console.log("Error reading headObject for key '" + inputKey + "' in '" + inputBucket + "'");
        console.log(err, err.stack);
        context.fail();
        return;
      }

      var originalFileMeta = data["Metadata"],
          originalFileOutputKey = "original-" + inputKey;

      // Add original file information to outputs object.
      outputs.push({
        key : originalFileOutputKey,
        type : extension,
        duration : parseInt(originalFileMeta.duration),
        width : parseInt(originalFileMeta.width),
        height : parseInt(originalFileMeta.height)
      });


      /*
      4. Rename and Copy the original file to the output bucket.
      */

      s3.copyObject({
        Bucket : outputBucket,
        Key : inputFileNameWithoutExtension + "/" + originalFileOutputKey,
        CopySource : inputBucket + "/" + inputKey,
      }, function (err, data) {
        if (err) {
          console.log("Error copying '" + inputKey + "' from '" + inputBucket + "' to '" + outputBucket + "'");
          console.log(err, err.stack);
          context.fail();
          return;
        }


        /*
        5. Delete the original file from the input bucket.
        */

        s3.deleteObject({
          Bucket : inputBucket,
          Key : inputKey
        }, function(err) {
          if (err) {
            console.log("Error deleting file in input bucket with name '" + inputBucket + " and for input key '" + inputKey + "'");
            console.log(err, err.stack); // an error occurred
            context.fail();
            return;
          }


          /*
          6. Send SNS with payload information regarding the original file's reference Id (used to find the
             StoryJob on the server for this file) and all output files now in the output bucket.
          */

          var payload = {
            referenceId : inputFileNameWithoutExtension,
            state : "COMPLETED",
            outputs : outputs
          };

          var snsMessage = JSON.stringify(payload),
              snsParams = {
                Message : snsMessage,
                Subject : "Input Bucket Cleanup SNS",
                TopicArn : "arn:aws:sns:us-east-1:123456789123:appName-s3-input-bucket-cleanup" // Replace with the correct topic ARN for your AWS setup
              };

          sns.publish(snsParams, function(err, data) {
            if (err) {
              console.log("Error sending cleanup completion SNS for input key '" + inputKey + "' in bucket '" + inputBucket + "'");
              console.log(err, err.stack); // an error occurred
              context.fail();
            }

            context.succeed("Finished cleanup of file for input key '" + inputKey + "' in bucket '" + inputBucket + "'");
          });
        });
      });
    });
  });
};

