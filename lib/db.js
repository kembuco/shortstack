var util = require('util'),
    settings = require('../config').get('mongo'),
    url = util.format('%s:%s/%s?auto_reconnect=%s&poolSize=%s', settings.host, settings.port, settings.db, settings.reconnect, settings.poolSize);

module.exports = db = require('mongoskin').db(url);

// Bindings
db.bind('users');