function setup (dispatcher, store) {
	dispatcher.on('button-click', (ev) => {
		store.n = store.n+1
    dispatcher.emit('update', store)
	}	)
	return
}

module.exports = setup
