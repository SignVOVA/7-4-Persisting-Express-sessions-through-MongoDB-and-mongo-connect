var http = require('http'),
	flights = require('./data'),
	// We requring db below.
	db = require('./db'),
	//and now we can pass my db variable below as a parameter
	//Session will be stored in our mongo db database.
	app = require('./app')(flights, db);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
