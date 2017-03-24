var express = require('express'),
    github = require('octonode'),
    fs = require('fs'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io')(server),
    port = process.env.PORT || 80;

    ids= JSON.parse(fs.readFileSync('ids.json', 'utf8'));

    var client = github.client({
      username : ids.username,
      password : ids.password
    });

//Run the server
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

io.on('connection', function(socket){
  client.get('/users/benjaminbra/repos', {}, function (err, status, body, headers) {
    list = Array();
    for(var i=0;body!=null && i<body.length;i++){
      repo = body[i];
      obj = {
        "name": repo.name,
        "description":  repo.description,
        "language": repo.language,
        "url": repo.html_url
      }
      console.log(obj);
      list.push(obj);
    }
    socket.emit('gitList',list);
  });
});