var Msg = require('../components/Message');

module.exports = Backbone.View.extend({
  events: {
    'click .btn': 'submit'
  },

  initialize: function() {
    var self = this;

    self.$el.html(JST.resetform(self.model));
  },

  submit: function() {
    var self = this,
        token = self.model.token,
        password = self.$('input[name="password"]').val(),
        confirm = self.$('input[name="confirm"]').val();

    if (self.message) self.message.remove();

    if ((!password || !confirm) || (password !== confirm)) {
      self.message = $(Msg.error('Password and password confirmation cannot be empty and must match.', 'span8 offset2'));

      self.$el.prepend(self.message);
    } else {
      $.ajax({
        type: 'PUT',
        url: ['/reset', token, password].join('/')
      }).done(function(response) {
        if (response.success) {
          self.message = $(Msg.success('Password has been changed.  Feel free to <a href="/">login</a>', 'span8 offset2'));
        } else {
          self.message = $(Msg.error  ('Password could not be changed. Please make sure your request has not expired and that you are using the correct link address.', 'span8 offset2'));
        }

        self.$el.prepend(self.message);
      });
    }
  }
});