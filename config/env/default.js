module.exports = {
  app : {
  	secret : process.env.APP_SECRET
  },
  express : {
    port : process.env.PORT || 5000
  },
  db : {
    database : process.env.POSTGRES_DATABASE,
    username : process.env.POSTGRES_USERNAME,
    password : process.env.POSTGRES_PASSWORD,
    host : process.env.POSTGRES_HOST
  },
  aws : {
    accessKeyId : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
    storyCreationUserAccessKeyId : process.env.AWS_STORY_CREATION_USER_ACCESS_KEY_ID,
    storyCreationUserSecretAccessKey : process.env.AWS_STORY_CREATION_USER_SECRET_ACCESS_KEY,
    s3InputBucket : process.env.S3_INPUT_BUCKET,
    s3OutputBucket : process.env.S3_OUTPUT_BUCKET
  }
}
