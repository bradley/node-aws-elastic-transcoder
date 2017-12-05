function notFound(req, res) {
  res.send(404, { status : 404, message : "Not found." });
}


module.exports = notFound;
