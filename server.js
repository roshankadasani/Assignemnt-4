var express = require('express'),
    http = require('http'),
    parser = require("body-parser"),
    movieDB = require('./modules/triviaDB'),
	  MongoClient = require('mongodb').MongoClient,
	  redis = require('redis'),
  	client = redis.createClient(),
    assert = require('assert'),
    ObjectId = require('mongodb').ObjectID;

var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');

client.set("right", 0);
client.set("wrong", 0);

var jsonParser = parser.json({
    type: 'application/json'
});
var router = express.Router();

app.use(parser.urlencoded({
    extended: true
}));
app.use(parser.json());

var url = 'mongodb://cpsc473:webdev@ds053146.mlab.com:53146/473projects';

app.get('/question', function(req, res) {



    var findQuestions = function(db, callback) {

        var data = db.collection('question_collection_set').find().toArray(function(err, documents) {
            res.json(documents);
            db.close();
        });
    };
    MongoClient.connect(url, function(err, db) {

        assert.equal(null, err);
        findQuestions(db, function() {});
    });
});

app.post('/question', function(req, res) {

    var question = req.body["question"];
    var answer = req.body["answer"];



    var insertDocument = function(db, callback) {



    	db.collection('question_collection_set').insert({
    		"question" : question,
    		"answer" : answer
    	});

		var data = db.collection('question_collection_set').find().toArray(function(err, documents) {

            res.json(documents);

        });
    };

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);

        insertDocument(db, function() {
            db.close();
        });
    });

});

app.post('/answer', function(req, res){

	var possible = req.body["possibleAns"];
	var id = req.body["answerId"];
	var actual = req.body["answer"];
	var correct;


    if(actual == possible){

        client.incr("right", function(err, reply){
        	console.log("Right: " +reply);
        });
        res.json(true);
    }

    if(actual != possible){

        client.incr("wrong", function(err, reply){
        	console.log("Wrong: " +reply);
        });
        res.json(false);
    }

});

app.get('/score', function(req, res){

	var right;
	var wrong;

	client.get("right", function(err, reply){
		right = reply;
		console.log("Right : "+right);

		client.get("wrong", function(err, reply){
			wrong = reply;
			console.log("Wrong : "+wrong);
				res.json({
					"right" : right,
					"wrong" : wrong
				});
		});

	});
});


require('./routes/index')(app);

app.listen(3000, function() {
    console.log('server is listening on port 3000');
});
