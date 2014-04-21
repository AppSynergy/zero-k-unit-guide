// set up ======================================================================
var express  = require('express');
var app      = express(); 								
var port  	 = process.env.PORT || 8080; 			

app.configure(function() {
	app.use(express.static(__dirname+"/public"));
	app.use(express.logger('dev'));
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
