var _ = require('underscore'),
    nodemailer = require('nodemailer'),
    fs = require('fs'),
    config = require('../config'),
    transport;

var compileTemplate = function(template) {
  return _.template(fs.readFileSync(__dirname + '/../templates/email/' + template + '.jst').toString());
};

var templates = {
  //reset: compileTemplate('templatename')
};

module.exports.init = function(app) {
  app.configure('development', function() {
    transport = nodemailer.createTransport('sendmail');
  });

  app.configure('heroku', function() {
    transport = nodemailer.createTransport("SES", {
      AWSAccessKeyID: "AWSACCESSKEY",
      AWSSecretKey: "AWS/Secret/key"
    });
  });
};

module.exports.send = function(template, args, callback) {
  var options = {
    from: config.get("system-email"),
    to: args.emails.join(', '),
    subject: args.subject,
    generateTextFromHTML: true,
    html: templates[template](args)
  };

  transport.sendMail(options, callback);
};