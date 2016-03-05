function setup (dispatcher, store, loop) {
	dispatcher.on('button-click', (ev) => {
	  store.n = store.n+1000
	  loop.update(store)
	})
	return
}

module.exports = setup
