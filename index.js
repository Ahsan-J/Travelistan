var express = require('express');
var socket = require('socket.io');
var bodyParser = require('body-parser');
var _ = require('lodash');
var fs = require('fs');
var {Travelistan} = require('./tsp')

var app = express();
var port = 9000;

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',function(request,response){
    response.send('<h1>Server Running</h1>')
})

app.get('/travelistan',function(request,response){

    response.json({
        status:true,
        code : 200,
        data : Travelistan()
    });
})

app.listen(port,function(){
    console.log("Running at "+port);
})
