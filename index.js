// support live reloading ?
var dev = true;
// deps
var _ = require('lodash')
var ud = require('ud')
var h = require('virtual-dom/h')
var EE = require('events').EventEmitter
var makeLog = require('./makeLog')
var el = document.querySelector('#app')
function declare (fn, store) {
  var ml = require('main-loop')
  var vd = require('virtual-dom')
  var l = ml(store, fn, vd)
  el.appendChild(l.target)
  return l
}



// data structures

function initialState () {
  return {
  	messages: [],
    hyperlog: makeLog(dispatcher),
  }
}

function message (to, msg) {
	return {
		message: msg,
		replyTo: to ? to : null,
	}
}



// defonced state
var dispatcher = ud.defonce(module, function () { return new EE()}, 'dispatcher')
// global app state is also defonced
var store = ud.defonce(module, initialState, 'store')



// view

function render (state) {


  var md5 = require('md5')

  // messages that are not replies
  var ms = _
    .chain(state.messages)
    .filter(function (d) {
      return !d.value.replyTo
    })
    .sortBy('change')
    .reverse()
    .value()

	return h('div', [

    // global input
		h('input', {
			onkeyup: inputKeyup,
			autofocus: true,
      placeholder: "post somethign...",
		}),

    // per-message view
		h('div', ms.map(_.partial(messageV, 0))),

	])

    function messageV (indent, m) {

      // get list of messages that are a reply to this message
      var rs = _
        .chain(state.messages)
        .filter(function (d) {
          return d.value.replyTo === m.key
        })
        .sortBy('change')
        .reverse()
        .value()

      var sender = md5(m.identity)

			return h('div', {
          style: {
            'margin-left': 2*indent + 'em',
          },
        },
        [
          // message key 
          h('p', m.key),
          // what the message says
          h('div', m.value.message),
          //h('pre', JSON.stringify(m, null, 2)),
          // list of replies to message
          h('div', rs.map(_.partial(messageV, indent+1))),
          // input to reply to comment
          h('input', {
            placeholder: "reply...",
            onkeydown: _.partial(replyTo, m.key)
          }),
        ]
      )
    }

//{
//          onclick: _.partial(messageClicked, m.identity)
//        },
//        // show a textbox below, to respond to this message
//        JSON.stringify(m.value))
//     }

  // send message on enter
  function replyTo (messageKey, ev) {
    onEnterInput(ev, function (reply) {
      dispatcher.emit('send-message', messageKey, reply)
    })
  }

  // send the message on enter
	function inputKeyup (ev) {
    onEnterInput(ev, function (message) {
      // no reply-to on universal input
      dispatcher.emit('send-message', null, message)
    })
		return
	}

  // clears + takes value from an input
  // when enter key is hit
  // calls `cb` on the value of the tetbox
  function onEnterInput (ev, cb) {
		// if user pressed the enter key
		if (ev.which === 13) {
			// see what's in the textbox
			var v = ev.target.value
			// something in the textbox?
			if (v) {
				// clear the textbox
				ev.target.value = ''
        cb(v)
      }
    }
  }
}


// actions
function actions (store) {
  dispatcher.on('swarmlog-data', function (d) {
    console.log('swarmlog-data', d)
  	// add received message to our webapp state
  	store.messages.push(d)
    dispatcher.emit('update', store)
  })
  
  dispatcher.on('send-message', function (replyTo, msg) {
  	// add message to the hyperlog
    var sm = message(replyTo, msg, store.pseudonym)
  	store.hyperlog.append(sm)
    dispatcher.emit('update', store)
  })
  
  dispatcher.on('message-clicked', function (id, _) {
    console.log(id)
  })
}



// setup
// a function to run on reload
function reload () {
  // delete old view
  el.innerHTML = ''
  // remove all old listeners on the dispatcher
  dispatcher.removeAllListeners()
}
// a function to run on setup
function setup () {
  if (dev)     // if we're devloping
    reload()   // reload
  // make a `loop` with `render` fn 
  // and `store` as initial state
  // view items will emit events over `dispatcher`
  var loop = declare(render, store)
  // `actions` will react to events on `dispatcher`
  // and mutate `store`, triggering `loop` to update
  actions(store) 
  dispatcher.on('update', loop.update)
}

// TODO onready
setup()
