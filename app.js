var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var cp = require('child_process').exec;
Array.prototype.randomElement = function(){
  return this[Math.floor(Math.random()* this.length)];
};

dbConnect = function(callback){
  MongoClient.connect('mongodb://bld-foosnet-01:27017/rallyTestData', function(err, db){
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

var getValuesFromDatabase = function(record, callback){
  dbConnect(function(db){
    db.collection('testData').find({"name": record}).toArray(function(err, doc){
      db.close();
      callback(doc[0][record]);
    });
  });
};

var getValuesAndRunCasper = function(count){
  getValuesFromDatabase('actors', function(actors){
    var tempString = "";
    getValuesFromDatabase('storyNames', function(storyNames){
      for(i=0;i<count;i++){
        tempString += actors.randomElement()+ " " +storyNames.randomElement();
        if(i!=count-1){
          tempString += "|,|";
        }
      }
      fs.writeFile("stories.csv", tempString, function(err){
        if(err) return console.log(err);
        runCasper();
      });
    });
  });
};

getValuesAndRunCasper(12);