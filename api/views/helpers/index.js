var dateFormat = require("dateformat");


var helpers = {
  date : function(value, object) {
    if (!value) {
      return null;
    }
    return dateFormat(value, "isoUtcDateTime");
  }
}


module.exports = helpers;
