var express = require('express');
var app = express();
var router = require('./app');
var port = process.env.PORT || 8000;

app.use(router);

app.listen(port,'0.0.0.0');

console.log('servidor funcionando por el puerto' + port);
