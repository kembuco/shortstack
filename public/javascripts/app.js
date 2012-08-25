var Presenter = require('./utils/Presenter'),
    Authnz = require('./utils/Authnz'),
    AuthRouter = require('./routers/AuthRouter'),
    config = require('./utils/config').initialize();

$(function() {
  Presenter.initialize({mainContent: $('#content')});

  console.log(config.get())
  
  Authnz.initialize({
    userId: config.get('id'),
    loginUrl: '/#/login',
    authenticated: config.get('authenticated'),
    roles: config.get('roles')
  });

  AuthRouter = new AuthRouter();

  Backbone.history.start();
});