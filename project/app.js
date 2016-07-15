
/**
 * Module dependencies.
 */

module.exports = function (flights, db) {
	var express = require('express');
	// storing mongo connect in a new variable
	var MongoStore = require('connect-mongo')(express);
	var routes = require('./routes')(flights);
	var path = require('path');
	var app = express();

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	// Line below is going to read a cookie that the browser sends to the server
	app.use(express.cookieParser());
	// Setup the sessions. Takes an object as an argument. This object going to configure the session.
	app.use(express.session({
		// Type in a secret. typically we add a randomise string in here. the secret is used to encrypt the session information.
		secret: 'keyboard cat',
		// we add a store property. This tells where we want to store the session. Declare a new mongostore instance
		store: new MongoStore({
			// we set one property here for mongoose connection. no db connection, but we can pass it in.
			mongoose_connection: db
		});
	}));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(function (req, res, next) {
		res.set('X-Powered-By', 'Flight Tracker');
		next();
	});
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

	app.get('/flight/:number', routes.flight);
	app.put('/flight/:number/arrived', routes.arrived);
	app.get('/list', routes.list);
	app.get('/arrivals', routes.arrivals);

	return app;
}
