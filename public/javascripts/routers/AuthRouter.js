var LoginView = require('./../views/LoginView'),
		ForgotView = require('./../views/ForgotView'),
		ResetView = require('./../views/ResetView'),
		PasswordView = require('../views/PasswordView'),
		Presenter = require('./../utils/Presenter'),
		Authnz = require('./../utils/Authnz'),
		BaseRouter = require('./BaseRouter');

module.exports = BaseRouter.extend({
	routes: {
		'logout': 'logout',
		'login': 'login',
		'forgot': 'forgot',
		'reset/:id': 'reset',
		'password/change': 'password',
	},

	filters: {
		logout: {
			before: Authnz.isAuthorized()
		},

		'password/change': {
			before: Authnz.isAuthorized()
		}
	},

	login: function() {
		var self = this;

		self.LoginView = self.LoginView || new LoginView();

		Presenter.presentMainContent(self.LoginView);
	},

	logout: function() {
		$.getJSON('/logout', function(response) {
			window.location.href = '/';
		});
	},

	forgot: function() {
		var self = this;

		self.forgotView = self.forgotView || new ForgotView();

		Presenter.presentMainContent(self.forgotView);
	},

	reset: function(token) {
		var self = this;

		self.resetView = self.resetView || new ResetView({model: {token: token}});

		Presenter.presentMainContent(self.resetView);
	},

	password: function() {
		var self = this;

		self.passwordView = self.passwordView || new PasswordView();

		Presenter.presentMainContent(self.passwordView);
	}
});