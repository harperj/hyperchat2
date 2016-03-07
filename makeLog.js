module.exports = function (dispatcher) {
	var swarmlog = require('swarmlog')
	var memdb = require('memdb')
	
	var log = swarmlog({
	  keys: require('./keys.json'),
	  sodium: require('chloride/browser'),
	  db: memdb(),
	  valueEncoding: 'json',
	  hubs: [ 'https://signalhub.mafintosh.com' ]
	})

	// any new data from the hyperlog
	log.createReadStream({ live: true })
 		 .on('data', data => 
			 // is dispatched as 'swarmlog-data'
       dispatcher.emit('swarmlog-data', data))

	return log
}
