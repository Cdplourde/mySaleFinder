var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");
//var cookieParser = require("cookie-parser");
//According to express-sessions this is no longer needed.  Leaving it here just in case.

var app = express();

// Set Handlebars.
var exphbs = require("express-handlebars");
var db = require("./models");

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.set("port", (process.env.PORT || 8080));

app.use("/public", express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// parse application/json
app.use(bodyParser.json());
//app.use(cookieParser()); 
//According to express-sessions this is no longer needed.  Leaving it here just in case.

//creates a session for the user. {secure: true} means that it is secure and can only be run on https
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: "WE'RE HAVING A FIRE ... sale",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}));

// Import routes and give the server access to them.
require("./controllers/mysales.js")(app);
require("./controllers/userControllers.js")(app);
//app.use(routes);

// Start our server so that it can begin listening to client requests.
// app.listen(app.get("port"), function() {
//     console.log("Server started on port " + app.get("port"));
// }); 
db.sequelize.sync({
    force: true
}).then(function () {
    app.listen(app.get("port"), function () {
        console.log("App listening on PORT " + app.get("port"));
    });
});
