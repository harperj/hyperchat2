var h = require('virtual-dom/h')
var main = require('main-loop')
var EE = require('events').EventEmitter
var dispatcher = new EE()
var loop = main({n:0}, render, require('virtual-dom'))
document.querySelector('#app').appendChild(loop.target)

function render (state) {
    return h('div', [
        h('h1', `clicked ${state.n} times`),
        h('button', { onclick: () => dispatcher.emit('inc', state.n) }, 'click me!')
    ])
}

dispatcher.on('inc', (n) => loop.update({n : n+1}))

