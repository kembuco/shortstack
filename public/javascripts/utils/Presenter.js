var Presenter = function() {};

_.extend(Presenter.prototype, {
  initialize: function(options) {
    _.extend(this, options);
  },

  presentMainContent: function(view) {
    var self = this;

    if (self.currentView && _.isFunction(self.currentView.destroy)) {
      self.currentView.remove();
      self.currentView.destroy();
    }

    self.mainContent.html(view.el);

    self.currentView = view;
  }
});

module.exports = new Presenter();