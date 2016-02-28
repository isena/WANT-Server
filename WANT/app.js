/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var express = require('express');
var cfenv = require('cfenv');
var bodyParser = require("body-parser");
var app = express();
var api = require('./routes/api');

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.use('/api', api);

var appEnv = cfenv.getAppEnv();
app.listen(appEnv.port, '0.0.0.0', function() {
	console.log("server starting on " + appEnv.url);
});