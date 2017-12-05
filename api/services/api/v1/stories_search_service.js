var _ = require("underscore");


var StoriesSearchService = function() {
  this.init.apply(this, arguments);
}

StoriesSearchService.prototype = (function() {

  function searchQueryForRequest(req) {
    var models = req.app.get("models"),
        searchParams = {
          userId : req.query.userId,
          active : true
        },
        idParams = {
          $gt : req.query.sinceId,
          $lte : req.query.maxId
        },
        limit = req.query.count || 10;

    // Remove empty values from idParams and conditionally set id params for search.
    idParams = _.pick(idParams, _.identity);
    if (Object.keys(idParams).length) {
      searchParams.id = idParams;
    }

    return {
      where : searchParams,
      limit : limit,
      order : "id DESC",
      include : [{ model : models.StoryMedia, as : "storyMedia" }]
    };
  }

  function metadataForStories(stories) {
    var metadata = {
      count : stories.length
    };

    // TODO: https://dev.twitter.com/rest/reference/get/search/tweets
    //   https://dev.twitter.com/rest/public/timelines

    return metadata;
  }

  return {

    constructor : StoriesSearchService,

    get req() {
      return this._req;
    },

    set req(req) {
      this._req = req;
      this._query = searchQueryForRequest(req);
    },

    get query() {
      return this._query;
    },

    set query(value) {
      // do nothing
    },

    init : function(req) {
      this.req = req;
    },

    search : function() {
      var models = this.req.app.get("models");

      return new Promise(_.bind(function(resolve, reject) {
        console.log(this.query);
        models.Story.findAll(this.query)
        .then(_.bind(function(stories) {
          this.req.app.render("story", { data : stories }, function(err, storiesJson) {
            if (err) {
              reject(err);
            }

            resolve({
              stories : storiesJson,
              metadata : metadataForStories(stories)
            });
          });
        }, this))
        .catch(function(err) {
          reject(err);
        });
      }, this));
    }
  }
})();


module.exports = StoriesSearchService;
