var express = require('express');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var https = require('https');

var url = 'https://ussouthcentral.services.azureml.net/workspaces/2d138b0890f844f2a1bf812e7e1e3280/services/03738f8ef25d44509d72ab6d7a8eb9dd/execute?api-version=2.0&details=true';
var apiKey = [insert here];

function scoreBody(emailBody) {
	var xmlHttp = new XMLHttpRequest();
  var data = {
    "Inputs": {
      "input1":
        {
          "ColumnNames": ["sentiment_label", "tweet_text"],
          "Values": [ [ "0", 0 ], [ "0", emailBody ], ]
        },        
      },
      "GlobalParameters": {}
  }
  xmlHttp.open( "POST", url, false );
	xmlHttp.setRequestHeader("Authorization", "Bearer " + apiKey);
	xmlHttp.setRequestHeader("Content-Type", "application/json");	
  xmlHttp.send( JSON.stringify(data) );
	var score = JSON.parse(xmlHttp.responseText);
  score = score["Results"]["output1"]["value"]["Values"][1][2];
  return score;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Email Score' });
});

/* POST to ML Web Service */
router.post('/', function (req, res) {
  var score = scoreBody(req.body.inputemail);
  console.log(req.body.inputemail);
  //res.send(req.body.inputemail + " " + score);
  res.render('index', {title: 'Email Score', email: req.body.inputemail, score: score})
});

module.exports = router;
