var path = require("path");


module.exports = function(app, passport) {
  // API ==========================================================================
  [
    "users",
    "sessions",
    "story_jobs",
    "stories"
  ].forEach(function (routeName) {
    require(path.resolve("api/controllers/api/v1/" + routeName))(app, passport);
  });
  app.use(app.router);


  // Error Handling ===============================================================
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, "Something broke!");
  });


  // Everything Else ==============================================================
  app.get("*", function(req, res) {
    res.send(404);
  });
};
