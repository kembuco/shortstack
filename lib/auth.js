var _ = require('underscore');

module.exports.allowAuthenticated = function(req, res, next) {
	if (req.session.user) return next();

	res.send(401);
};

module.exports.allowAuthorized = function(roles, mode) {
  return function(req, res, next) {
    if (!req.session.user) return res.send(401);

    var common = _.intersection(req.session.user.r, roles);

    var allow = (!mode || mode === 'all') ? common.length == roles.length : common.length > 0;

    if (allow) {
      next();
    } else {
      res.send(401);
    }
  };
}

module.exports.isCurrentUser = function(req, res, next) {
  if (req.params.id === req.session.user._id) return next();

  res.send(401);
}