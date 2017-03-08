const express  = require('express');
const app      = express();
const port = (process.env.PORT || 5000);
const http = require('http');
const bodyParser   = require('body-parser');
const env = process.argv[2]=='-prod'?'prod':'dev';
const compression = require('compression');

var server = http.createServer(app);

//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/Boilerplate');

//var io = require('socket.io').listen(server);


if(env == 'prod'){
    app.use(compression());
}

app.use("/node_modules", express.static(__dirname + '/node_modules'));


// routes ======================================================================
app.set('view engine', 'ejs');
app.use("/dist", express.static(__dirname + '/dist'));
app.use(bodyParser()); // get information from html forms

app.use("/build", express.static(__dirname + '/build'));


app.get(['/'], function(req, res) {
    res.render('index.ejs', {
        env: env
    });
});


server.listen(port);
console.log("Listening on: "+port);