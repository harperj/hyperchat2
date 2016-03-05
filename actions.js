
// TODO all data structures should be in the same place
function message (m, p) {
    return {
        message: m,
        pseudonym: p,
    }
}


function setup (dispatcher, store, loop) {

    dispatcher.on('swarmlog-data', d => {
        console.log('swarmlog-data', d)
        // add received message to our webapp state
        store.messages.push(d)
        dispatcher.emit('update', store)
    })

    dispatcher.on('send-message', m => {
        // add message to the hyperlog
        var sm = message(m, store.pseudonym)
        store.hyperlog.append(sm)
        dispatcher.emit('update', store)
    })

    dispatcher.on('new-pseudonym', p => {
        store.pseudonym = p
        dispatcher.emit('update', store)
    })

	return
}

module.exports = setup
