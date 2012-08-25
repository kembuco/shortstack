var Authnz = function(){};

_(Authnz.prototype).extend({
	initialize: function(options) {
		_(this).extend(options);
	},

	isAuthorized: function(roles, mode) {
		var self = this;

		return function() {
			if (self.authenticated) {
				if (!roles) return true;

				var common = _.intersection(self.roles, roles);

				return (!mode || mode === 'all') ? common.length == roles.length : common.length > 0;
			}

			window.location.href = self.loginUrl;

			return false;
		}
	}
});

module.exports = new Authnz();