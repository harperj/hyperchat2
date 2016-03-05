var h = require('virtual-dom/h')

module.exports = (dispatcher) => {

	// a render fn that returns hyperscript
	function render (state) {
	  return h('div', [
	    h('h1', `clicked ${state.n} times`),
	    h('button', { onclick: handleClick }, 'click')
	  ])
	
	  function handleClick (ev) {
	    dispatcher.emit('button-click', ev)
	  }
	}

	// this module returns this fn
	return render
}

