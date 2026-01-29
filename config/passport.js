const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const AnonymousStrategy = require('passport-anonymous').Strategy;
const bcrypt = require("bcrypt");
const pool = require("../db/pool");

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, username, password, done) => {
			const firstname = req.body.firstname;
			const lastname = req.body.lastname;
      
			try {
				const { rows } = await pool.query(
					"SELECT * FROM members WHERE firstname = $1 and lastname = $2 and email = $3",
					[firstname, lastname, username],
				);
				const user = rows[0];
        req.session.messages = [];
				if (!user) {
          // req.flash("error", "Incorrect first or last name");
					return done(null, false, { message: "Incorrect first, last name or email" });
				}
				const match = await bcrypt.compare(password, user.password);
				if (!match) {
          // req.flash("error", "Incorrect password");
					return done(null, false, { message: "Incorrect password" });
				}
				return done(null, user);
			} catch (err) {
				console.error(err);
				return done(err);
			}
		},
	),
);

passport.use(new AnonymousStrategy());

passport.serializeUser((user, done) => {
	done(null, user.member_id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM members WHERE member_id = $1",
			[id],
		);
		const user = rows[0];
		done(null, user);
	} catch (err) {
		done(err);
	}
});

module.exports = passport;
