var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var cp = require('child_process').exec;

dbConnect = function(callback){
  MongoClient.connect('mongodb://localhost:27017/testdata', function(err, db){
    if(err) return console.log(err);
    callback(db);
  });
};

var runCasper = function(){
  var child = cp('casperjs test7.js --ssl-protocol=any');
  child.stdout.on('data', function(data){
    console.log(data);
  });

  child.stderr.on('data', function(data){
    console.log(data);
  });

  child.on('close', function(code){
    console.log("Process ended: "+code);
  });
};

var createCsvFileAndRun = function(){
  var storiesString = "Story One,Story Two,Story Three,Story Four,Story Five,Story Six";
  fs.writeFile("stories.csv", storiesString, function(err){
    if(err) return console.log(err);
    runCasper();
  });
};

createCsvFileAndRun();