module.exports = Backbone.Router.extend({
	initialize: function() {
		var handlers = Backbone.history.handlers,
			self = this;
		
		_(self.filters).each(function(filter, route) {
			_(handlers).each(function(handler) {
				if (handler.route.test(route)) {
					handler.callback = _(handler.callback).wrap(function(fn, fragment) {
						if (_(filter.before).isFunction() && filter.before.call(self) !== false) {
							fn.call(self, fragment);	

							if (_(filter.after).isFunction()) {
								filter.after.call(self);
							}
						}
					});
				}
			});
		});
	}
});