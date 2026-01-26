const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const routes = require("./routers/usersRouter");
require("./config/passport");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({ secret: "secretttt", resave: false, saveUninitialized: false }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
	console.log(req.session);
	console.log(req.user);
	next();
});
app.use("/", routes);

app.listen(4000, (error) => {
	if (error) {
		throw error;
	}
	console.log("app listening on port 3000!");
});


