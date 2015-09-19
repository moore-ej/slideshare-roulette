var express = require("express");
var sha1 = require('js-sha1');
var request = require('request');
var fs = require('fs');

var app = express();


var license = JSON.parse(fs.readFileSync('slideshare.json', 'utf8'));
var corpora = JSON.parse(fs.readFileSync('corpora.json', 'utf8'));

/* serves main page */
app.get("/", function(req, res) {
	res.sendfile('./public/index.html')
});

// slideshare proxy
app.post("/slideshare", function(req, res) { 
	fetch(
		function(document) {
			res.send(document);
		}
	);
	
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){ 
	console.log('static file request : ' + req.params);
	res.sendfile( __dirname + '/public/' + req.params[0]); 
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
	console.log("Listening on " + port);
});

function fetch(callback) {
	var url = makeUrl();
	
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
		callback(body);
	  }
	});	
}

function makeUrl() {
	var ts = Math.floor(Date.now() / 1000);		
	var hash = sha1(license.secret + ts);
	var term = corpora[Math.floor(Math.random()*corpora.length)];
	
	console.log("Searching for " + term);
	
	return "https://www.slideshare.net/api/2/search_slideshows?"+
		"q=" + term +
		"&page=1&items_per_page=1&lang=en&sort=mostviewed&upload_date=any&fileformat=ppt&file_type=presentations&cc=1&cc_adapt=1&cc_commercial=1" + 
		"&api_key=" + license.apiKey +
		"&hash="+ hash +
		"&ts=" + ts;
}