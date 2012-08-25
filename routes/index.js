var db = require('../lib/db'),
    config = require('../config'),
    email = require('../lib/email');

module.exports = function(app) {
  app.get('/', index);

  require('./auth')(app);
};

var index = function(req, res) {
  res.render('index', {
    title: 'Application',
    session: req.session,
    id: (req.session.user || {})._id || 0, 
    authenticated: !!req.session.user, 
    roles: JSON.stringify((req.session.user || {}).r || [])
  });
};