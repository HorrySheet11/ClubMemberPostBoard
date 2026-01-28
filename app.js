const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const routes = require("./routers/usersRouter");
require("./config/passport");
const pgSession = require("connect-pg-simple")(session);
const pgPool = require("./db/pool");
const flash = require('connect-flash')

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		store: new pgSession({
			pool: pgPool,
			tableName: "member_sessions",
      createTableIfMissing: true, 
		}),
		cookie: { maxAge: 1000 * 60 * 60 * 24 },
	}),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.error_msg = req.flash('error');
  res.locals.success_msg = req.flash('success');
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
	console.log(req.session);
	console.log(req.user);
	next();
});
app.use("/", routes);
const port = process.env.PORT || 3000;
app.listen(port, (error) => {
	if (error) {
		throw error;
	}
	console.log(`app listening on port 	${port}!`);
});
