var express = require('express');
global.app = express();

var exphbs  = require('express-handlebars');
global.app.engine('handlebars', exphbs({defaultLayout: 'main'}));
global.app.set('view engine', 'handlebars');

//Defining middleware to serve static files
global.app.use('/static', express.static('static'));
