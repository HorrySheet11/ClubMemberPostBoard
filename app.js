const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const routes = require("./routers/usersRouter");
const passwordController = require("./controllers/passportController");


const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
	next();
});
app.use("/", routes);
app.use(
	session({ secret: "secretttt", resave: false, saveUninitialized: false }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.listen(3000, (error) => {
	if (error) {
		throw error;
	}
	console.log("app listening on port 3000!");
});


