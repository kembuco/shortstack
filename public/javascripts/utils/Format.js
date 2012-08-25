var FormatUtils = function() {};

_(FormatUtils.prototype).extend({
  millisecondsToHMS: function(milliseconds) {
    var seconds = milliseconds / 1000,
        hours = Math.floor(seconds / 3600),
        minutesNumerator = seconds % 3600,
        minutes = Math.floor(minutesNumerator / 60),
        seconds = Math.ceil(minutesNumerator % 60),
        pad = function(number) { return +number < 10 ? '0' + number : number };

    return [pad(hours), pad(minutes), pad(seconds)].join(':');
  },

  path: function() {
    return _.toArray(arguments).join('/');
  },

  interpolate: function(template) {
    var args = _.toArray(arguments).slice(1);

    return template.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  },

  toLetter: function(number) {
    return String.fromCharCode(number + 97);
  }
});

module.exports = new FormatUtils;