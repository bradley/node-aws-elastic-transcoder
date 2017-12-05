var AWS = require("aws-sdk"),
    config = require("config");


var TokenVendingMachine = function () {
 this.init.apply(this, arguments);
}

TokenVendingMachine.prototype = (function () {

  return {

    constructor : TokenVendingMachine,

    get apiVersion() {
      return this._apiVersion;
    },

    set apiVersion(apiVersion) {
      // do nothing
    },

    get TTL() {
      return this._TTL;
    },

    set TTL(TTL) {
      this._TTL = TTL;
    },

    init : function () {
      this._apiVersion = "2011-06-15";
      this._TTL = 3600; // 1 hour.
    },

    getStoryCreationAccessCredentials : function (TTL) {
      var sts = new AWS.STS({
            apiVersion : this.apiVersion,
            accessKeyId : config.aws.storyCreationUserAccessKeyId,
            secretAccessKey : config.aws.storyCreationUserSecretAccessKey
          }),
          requestParams = {
            DurationSeconds : TTL || this.TTL
          };

      return new Promise(function(resolve, reject) {
        sts.getSessionToken(requestParams, function (err, data) {
          if (err) {
            reject(err);
            return;
          }

          var credentials = {
            accessKeyId : data.Credentials.AccessKeyId,
            secretAccessKey : data.Credentials.SecretAccessKey,
            sessionToken : data.Credentials.SessionToken,
            expiration : data.Credentials.Expiration
          }

          resolve(credentials);
        });

      });
    }
  }
})();


module.exports = TokenVendingMachine;
