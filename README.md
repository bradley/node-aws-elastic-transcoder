# Node/AWS Elastic Transcoding App

This repository contains a working node application that provides an API for creating user-associated video transcodes using several components of the AWS ecosystem.

The application itself does not handle the actual uploading of files to AWS, as this application is intended to work in tandem with another application that would do that part of the process, such as a mobile application. However, this application does handle the administrative work around this kind of task, such as providing temporary AWS access tokens to its client application, communication with the AWS pipeline via SNS (to listen for transcoder events such as completion), and persisting transcoded video file information for a user. The application also contains the AWS Lambda files one would need to add to their AWS account in order to perform the work on Amazon's end, with documentation.

This repository also includes an example `.html` file where you can play with the API and AWS to test the application itself.

This repository makes heavy use of its Wiki for documentation, so please look there for further documentation.

## The Application

The basic concept for this application is that the application has users and that those users want to upload video files from the client application (web, mobile, or both) to be associated with their accounts. We call these video files "Stories". For each upload, the last video file the user uploaded without error will become their "Primary Story".

This application provides an API that works along a client application as a service and persistence layer for storing user and transcoded video information. This application oversees the lifecycle of video uploads as they move from the client application, through AWS, and back to the persistence layer provided herein.

Some technical aspects of this application:
- Secure handling of AWS access for client (no storing AWS creds in client app)
- AWS SNS validation
- Secure handling of ENV variables
- JWT based user authentication for API use (using Passport)
- Postgres database (using Sequelize as ORM)

## Documentation
- [Local Setup and Development](https://github.com/bradley/node-aws-elastic-transcoder/wiki/Local-Setup-and-Development)
- [API](https://github.com/bradley/node-aws-elastic-transcoder/wiki/API)
  - [User](https://github.com/bradley/node-aws-elastic-transcoder/wiki/API#user-1)
  - [Session](https://github.com/bradley/node-aws-elastic-transcoder/wiki/API#session-1)
  - [StoryJob](https://github.com/bradley/node-aws-elastic-transcoder/wiki/API#storyjob-1)
  - [Story](https://github.com/bradley/node-aws-elastic-transcoder/wiki/API#story-1)
- [Story Upload Flow](https://github.com/bradley/node-aws-elastic-transcoder/wiki/Story-Upload-Flow)
