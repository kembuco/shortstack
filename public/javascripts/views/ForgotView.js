var Msg = require('./../components/Message');

module.exports = Backbone.View.extend({
  className: 'forgot row',

  events: {
    'click .btn': 'sendResetRequest'
  },

  initialize: function() {
    this.$el.html(JST.forgot());
  },

  sendResetRequest: function() {
    var self = this,
        email = self.$('.email').val();

    if (self.message) self.message.remove();

    if (email) {
      $.ajax({
        type: 'POST',
        url: '/reset/' + email
      }).done(function(response) {
        if (response.success) {
          self.message = $(Msg.success('An email has been sent with instructions on resetting your password.', 'span8 offset2'));
        } else {
          self.message = $(Msg.error('The reset email could not be sent. Please check your email address and try again.', 'span8 offset2'));
        }

        self.message.insertBefore(self.$el);
      }); 
    }
  }
});