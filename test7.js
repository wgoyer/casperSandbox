// Note: lookup page objects on the interwebz

var casper = require('casper').create({
	verbose: true,
	logLevel: 'error',
	pageSettings: {
		loadImages: true,
		loadPlugins: true
	},
	viewportSize:{
		width: 1024,
		height: 1280
	}
});
casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');

var fs = require('fs');

//Reading CSV file for story names
var someStories = fs.read('stories.csv').split(',');
for(i=0;i<someStories.length;i++){
  console.log(i+ " "+someStories[i]);
}



//Bind shim
casper.on('page.initialized', function(){
    this.evaluate(function(){
        var isFunction = function(o) {
          return typeof o == 'function';
        };

        var bind,
          slice = [].slice,
          proto = Function.prototype,
          featureMap;

        featureMap = {
          'function-bind': 'bind'
        };

        function has(feature) {
          var prop = featureMap[feature];
          return isFunction(proto[prop]);
        }

        // check for missing features
        if (!has('function-bind')) {
          // adapted from Mozilla Developer Network example at
          // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
          bind = function bind(obj) {
            var args = slice.call(arguments, 1),
              self = this,
              nop = function() {
              },
              bound = function() {
                return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
              };
            nop.prototype = this.prototype || {}; // Firefox cries sometimes if prototype is undefined
            bound.prototype = new nop();
            return bound;
          };
          proto.bind = bind;
        }
    });
});

casper.on('remove.message', function(msg){
	this.echo('remote message: '+msg);
});

casper.on('page.error', function(msg, trace) {
	this.echo('Page Error: '+ msg, "ERROR");
});


casper.start('https://test5cluster.rallydev.com', function(){
	this.echo("Logging in... (wait 1)");
	this.wait(1000, function(){
		this.fill('form#login-form', {
			j_username: 'reader@rallydev.com',
			j_password: 'rallydev1a'
		}, true);
	});
});

casper.then(function(){
	this.echo("Waiting for login to finish loading...(wait 5)");
	this.wait(5000, function(){
		this.echo("Title: "+this.getTitle());
	});
});

casper.then(function(){
	this.open('https://test5cluster.rallydev.com/#/18466102277d/backlog').then(function(){
		this.echo("Opening Backlog page (wait 5)...");
		this.wait(5000, function(){
		});
	});
});

casper.then(function(){
	this.click('button.x-btn-text');
});

var currentStory = "";
casper.eachThen(someStories, function(storyName){
	currentStory = storyName.data;
	console.log("Trying to send key strokes to text field with: "+currentStory);
	this.sendKeys('input.main-value', currentStory);
	casper.then(function(){
		this.wait(2000, function(){
			this.click('button#ext-gen97');
		});
	});
});

casper.then(function(){
	this.wait(2000, function(){
		console.log('All done.');
	});
});
casper.run();
