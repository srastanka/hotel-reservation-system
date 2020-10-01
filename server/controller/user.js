exports.userMiddleware = function(req, res, next){
  let { username, password } = req.body;
  if(!username && req.query) {
    username = req.query.username;
  }
  res.locals.user = { username, password };
  next();
}
