var ud = require('ud')
var EE = require('events').EventEmitter
var dispatcher = ud.defonce(module, function () { return new EE()}, 'dispatcher')

module.exports = dispatcher
