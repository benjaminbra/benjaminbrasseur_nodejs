var express = require('express'),
    github = require('octonode'),
    fs = require('fs'),
    ids = JSON.parse(fs.readFileSync('ids.json', 'utf8')),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io')(server),
    port = process.env.PORT || ids.port;

var client = github.client({
    username: ids.username,
    password: ids.password
});

//Run the server
server.listen(port, ids.domain, function() {
    console.log('Server host on ' + ids.domain);
    console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

io.on('connection', function(socket) {
    client.get('/users/benjaminbra/repos', {}, function(err, status, body, headers) {
        socket.emit('clean');
        for (var i = 0; body != null && i < body.length; i++) {
            repo = body[i];
            (function(repo) {
                client.get('/repos/' + ids.username + '/' + repo.name + '/languages', {}, function(err, status, languages, headers) {
                    obj = {
                        "name": repo.name,
                        "description": repo.description,
                        "language": languages,
                        "url": repo.html_url
                    }
                    console.log(obj);
                    socket.emit('gitAdd', obj);
                });
            })(repo);

        }
    });
});
