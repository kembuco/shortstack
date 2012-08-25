var Msg = require('../components/Message');

module.exports = Backbone.View.extend({
  events: {
    'click .btn': 'submit'
  },

  initialize: function() {
    var self = this;

    self.$el.html(JST.passwordform());
  },

  submit: function() {
    var self = this,
        current = self.$('input[name="current"]').val(),
        password = self.$('input[name="password"]').val(),
        confirm = self.$('input[name="confirm"]').val();

    if (self.message) self.message.remove();

    if ((!password || !confirm) || (password !== confirm)) {
      self.message = $(Msg.error('New password and password confirmation cannot be empty and must match.', 'span8 offset2'));

      self.$el.prepend(self.message);
    } else {
      $.ajax({
        type: 'PUT',
        url: ['/change', current, password].join('/')
      }).done(function(response) {
        if (response.success) {
          self.message = $(Msg.success('Password has been changed.', 'span8 offset2'));
        } else {
          self.message = $(Msg.error  ('Password could not be changed. Please make sure your current password is correct and try again.', 'span8 offset2'));
        }

        self.$el.prepend(self.message);
      });
    }
  }
});