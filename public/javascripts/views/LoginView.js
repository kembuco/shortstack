var Msg = require('./../components/Message');

module.exports = Backbone.View.extend({
	className: 'login row',

	events: {
		'click .btn': 'login',
		'click .close': 'closeMessage'
	},

	initialize: function() {
		var self = this;

		self.$el.html(JST.login());
	},

	closeMessage: function() {
		this.$('.alert').hide();
	},

	login: function() {
		var self = this,
			username = self.$('#username').val(),
			password = self.$('#password').val();
					
		self.$('.form .alert').remove();

		if (username && password) {
			$.getJSON(['/login', username, password].join('/'), function(response) {
				if (response.success) {
					window.location.href = '/';
				} else {
					self.$('.form').prepend(Msg.error('Invalid credentials. Please try again.'));
				}
			});
		}
	}
});