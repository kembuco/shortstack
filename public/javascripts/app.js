var Presenter = require('./utils/Presenter'),
    Authnz = require('./utils/Authnz'),
    AuthRouter = require('./routers/AuthRouter');

$(function() {
  Presenter.initialize({mainContent: $('#content')});
  Authnz.initialize({
    userId: window.id,
    loginUrl: '/#/login',
    authenticated: window.authenticated,
    roles: window.roles
  });

  AuthRouter = new AuthRouter();

  Backbone.history.start();
});