var ud = require('ud')
var EE = require('events').EventEmitter
var dispatcher = ud.defonce(module, function () { return new EE()}, 'dispatcher')

function setup_actions (store) {
  dispatcher.on('swarmlog-data', function (d) {
    // add received message to our webapp state
    store.messages.push(d)
    dispatcher.emit('update', store)
  })

  dispatcher.on('textbox-value', function (messageID, msg) {
    store.inputs[messageID] = msg
    dispatcher.emit('update', store)
  })
  
  dispatcher.on('send-message', function (replyTo, msg) {
    // add message to the hyperlog
    var sm = message(replyTo, msg, store.pseudonym)
    store.hyperlog.append(sm)
    // empty the input box
    dispatcher.emit('edit-input', replyTo, '')
    dispatcher.emit('update', store)
  })

  dispatcher.on('change-pseudonym', (p) => {
    store.pseudonym = p
    db.put('pseudonym', p)
    dispatcher.emit('update', store)
  })

  dispatcher.on('edit-input', (mKey, v) => {
    store.inputs[mKey] = v
    dispatcher.emit('update', store)
  })
}

module.exports = dispatcher
