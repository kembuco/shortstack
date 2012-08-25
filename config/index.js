var util = require('util'),
	path = util.format('%s/%s.json', __dirname, process.env.NODE_ENV || 'development');

module.exports = config = require('nconf');

config.file({file: path});