function swarmlog () {
    var slog = require('swarmlog')
    var memdb = require('memdb')
    var log = slog({
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


// function to setup initial app state
function setup (dispatcher) { 
	  // put the schema for your app state here
    return { 
        messages: [], 
        psuedonym: '', 
        hyperlog: swarmlog(dispatcher),
    }
}

module.exports = setup
