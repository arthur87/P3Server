//
//  app.js
//  P3
//
//  Created by asakawa on 2015/05/15.
//  Copyright (c) 2015 asakawa. All rights reserved.
//

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});


var io = socketIO.listen(server);
io.sockets.on('connection', function(socket) {
  socket.on('message', function(data) {
    io.sockets.emit('message', data);
  });
})

app.get('/', exports.index = function(request, response) {
  response.render('index');
});


app.post('/api', exports.api = function(request, response) {
  try {
    var json = JSON.stringify(request.body);
    io.sockets.emit('message', json);
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(json);
  }catch(error) {
    response.writeHead(400, {'Content-Type': 'application/json'});
    response.end(json);
  }
});
