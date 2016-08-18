var Twitter = require('twitter-js-client').Twitter;

var config = new Twitter({
  "consumerKey": "meG8NL7boXdtHcHNN8niDDK15",
  "consumerSecret": "2RUCQXRUm1PcOZ3sQi20y2JZBXbWEtl8FZTmShIVRdEnMHXtH4",
  "accessToken": "3028894907-UvaLiJ7HWsXSr1jPWa82nbKHOp3YkTSw3waMZOk",
  "accessTokenSecret": "1ZipiDZUAiNVYFqEcjnc6dSIMkGWkYSMeWGmDwj28SIg1"
});

var twitter = new Twitter(config);

exports.getUserData = function(req, res){

  twitter.getUserTimeline({
    screen_name : 'willarends',
    count: 5
  }, function(error, response, body){
    res.status(404).send({
      'error' : 'User Not Found'
    });
  }, function(data){
      res.send({
        result : {
          'userData' : data
        }
      });
  });

};
