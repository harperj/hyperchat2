// set up dom stuff
var vdom   = require('virtual-dom')
, hyperx   = require('hyperx')
, hx       = hyperx(vdom.h)
, main     = require('main-loop')
, loop     = main({ times: 0 }, render, vdom)
document.querySelector('#app').appendChild(loop.target)

function render (state) {
    return hx`<div>
        <h1>clicked ${state.times} times</h1>
        <button onclick=${onclick}>click me!</button>
        </div>`

    function onclick () {
        loop.update({ times: state.times + 1 })
    }
}

console.log('run')
