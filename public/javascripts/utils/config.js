var Config = function() {}

_(Config.prototype).extend({
  config: {},

  initialize: function() {
    var self = this;

    _($('meta[data-variable="true"]')).each(function(tag) { 
      self.config[tag.getAttribute('name')] = JSON.parse(tag.getAttribute('content'))
    });

    return self;
  },

  get: function(property) {
    if (!property) return this.config;

    return this.config[property];
  }
});
module.exports = new Config;