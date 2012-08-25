var bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    _ = require('underscore'),
    db = require('../lib/db'),
    auth = require('../lib/auth'),
    email = require('../lib/email'),
    config = require('../config');

module.exports = function(app) {
  app.get('/logout', logout);
  app.get('/login/:email/:password', login);
  app.post('/reset/:email', sendResetToken);
  app.put('/reset/:token/:password', resetPassword);
  app.put('/change/:current/:password', auth.allowAuthenticated, changePassword);
};

var login = function(req, res, next) {
  var email = req.params.email,
      password = req.params.password;

  if (email && password) {
    db.users.findOne({e: email}, {'e': 1, 'fn': 1, 'ln': 1, 'pw': 1, 'r': 1}, function(err, user) {
      if (err) return next(err);

      if (user) {
        bcrypt.compare(password, user.pw, function(err, result) {
          if (err) return next(err);

          if (result) {
            delete user.pw;

            req.session.user = user;

            res.send({success: true});
          } else {
            res.send({success: false});
          }
        })
      } else {
        res.send({success: false});
      }
    });
  } else {
    res.send({success: false});
  }
};

var logout = function(req, res, next) {
  req.session.destroy();

  res.send({success: true});
}

var sendResetToken = function(req, res, next) {
  var criteria = {e: req.params.email};

  // Make sure this email address is in our system
  db.users.findOne(criteria, function(err, user) {
    if (err) return next(err);
    if (!user) return res.send({success: false});

    var shasum = crypto.createHash('sha1');

    // Create the reset token
    crypto.randomBytes(128, function(ex, buf) {
      shasum.update(buf);

      var expire = Date.now() + (1000 * 60 * 60 * 48),
          token = shasum.digest('hex');

      // Update the user record with the reset token and expiration
      db.users.update(criteria, {$set: {rt: token, re: expire}}, function(err) {
        if (err) return res.send({success: false});

        // Update local user object with email info
        _(user).extend({
          re: new Date(expire),
          url: config.get('url') + '#/reset/' + token,
          emails: [user.e],
          subject: 'Application password reset'
        });

        // Send the reset email to the user
        email.send('reset', user, function(err, message) {
          res.send({success: !!!err});
        });
      });
    });
  });
};

var updatePassword = function(user, req, res, next) {
  bcrypt.hash(req.params.password, req.params.password.length, function(err, hash) {
    if (err) return next(err);

    db.users.updateById(user._id, {$set: {pw: hash, rt: null, re: null}}, function() {
      res.send({success: true});
    });
  });
};

var resetPassword = function(req, res, next) {
  db.users.findOne({rt: req.params.token}, {'_id': 1, 're': 1}, function(err, user) {
    if (err) return next(err);
    if (!user || Date.now > user.re) return res.send({success: false});

    updatePassword(user, req, res, next);
  });
};

var changePassword = function(req, res, next) {
  db.users.findOne({e: req.session.user.e}, {'_id': 1, 'pw': 1}, function(err, user) {
    if (err) return next(err);
    if (!user) return res.send({success: false});

    bcrypt.compare(req.params.current, user.pw, function(err, result) {
      if (err) return next(err);
      if (!result) return res.send({success: false});

      updatePassword(user, req, res, next);
    });
  });
}