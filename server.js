var express = require('express');

var app = express();
var server = app.listen (3000);

app.use(express.static('Public'));

console.log ("my biscuits are burning");

var socket = require('socket.io');

var io = socket(server, {
	cors:{
	origin: "http://localhost:3000",
	methods: ["GET", "POST"],
	credentials: true,
	},
	});  

io.sockets.on('connection', newConnection);

function newConnection(socket) {
	console.log('new connection' + socket.id);

	socket.on('mouse', mouseMsg);

	function mouseMsg(data)	{
		socket.broadcast.emit('mouse', data);
		console.log(data);
	}


	
}