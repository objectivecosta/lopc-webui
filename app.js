var express = require('express');
global.app = express();

var exphbs  = require('express-handlebars');
global.app.engine('handlebars', exphbs({defaultLayout: 'main'}));
global.app.set('view engine', 'handlebars');

global.app.use('/static', express.static('static'));

app.get("/", function(req, res){
  res.render("login")
});

global.app.listen(3001);
