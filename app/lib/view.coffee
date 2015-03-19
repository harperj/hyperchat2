$ = require 'jquery'
postJson = require 'post-json-nicely'

exports.setup = () ->

	# add some silliness to the DOM
	$('body').append('<p>remember to write pure functions</p>')
	$('body').append('<img src="assets/wand.gif">')

	# post some nonsense to the server
	myRequest = postJson($, '/json', {hi:'hey'})
	myRequest.done(
		(data, ...) -> console.log 'server says:', JSON.parse(data))
	myRequest.fail(
		(jqXHR, textStatus, err) -> console.log 'post req failed!', jqXHR, textStatus, err)
