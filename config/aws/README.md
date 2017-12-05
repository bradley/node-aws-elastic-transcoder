# AWS Configuration Documentation
The files in this folder are not used by the server app itself. Rather, these files are references to files we use on AWS to perform automated work.

### Transcoder Lambda
This code is used by the AWS lambda service to automatically transcode uploaded files posted to our S3 input buckets. Further documentation can be found in the wiki.

### Input Bucket Cleanup Lambda
This code is used by the AWS lambda service to automatically cleanup files uploaded to our input buckets after they have been transcoded and the transcoded files have been placed in our output bucket.
