var fs = require('fs');
var express = require('express');
var app = express();

app.get('/', function(req, res) {
	console.log("GET /");
	fs.readFile("brackets.json", function(err, data) {
		if (err) {
			throw err;
		}
		res.json(Object.keys(JSON.parse(data)));
	});
});

app.get('/:bracketId', function(req, res) {
	console.log("GET /:bracketId");
	var bracketId = req.params.bracketId;
	fs.readFile("brackets.json", function(err, data) {
		if (err) {
			throw err;
		}
		res.json(JSON.parse(data)[bracketId]);
	});
});

app.post('/:bracketId', function(req, res) {
	console.log("POST /:bracketId");
	var bracketId = req.params.bracketId;
	var jsonString = '';

	req.on('data', function (data) {
		jsonString += data;
	});

	req.on('end', function () {
		//console.log(JSON.parse(jsonString));
		//res.end();
		fs.readFile("brackets.json", function(err, data) {
			if (err) {
				throw err;
			}
			var fullFile = JSON.parse(data);
			fullFile[bracketId] = JSON.parse(jsonString);
			fs.writeFile("brackets.json", JSON.stringify(fullFile, null, 4), function() {
				res.end();
			})
		});
	});
});

app.delete('/:bracketId', function(req, res) {
	console.log("DELETE /:bracketId");
	var bracketId = req.params.bracketId;

	fs.readFile("brackets.json", function(err, data) {
		if (err) {
			throw err;
		}
		var fullFile = JSON.parse(data);
		delete fullFile[bracketId];
		fs.writeFile("brackets.json", JSON.stringify(fullFile), function() {
			res.end();
		});
	})
});

app.listen(8080, function() {
	console.log("Listening on port 8080");
});