const pool = require("../db/pool");
const bcrypt = require("bcrypt");
const passport = require("passport");



async function localStrategy(firstname, lastname, email, password, done) {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM members WHERE firstname = $1 and lastname = $2 and email = $3",
			[firstname, lastname, email],
		);
		const user = rows[0];

		if (!user) {
			return done(null, false, { message: "Incorrect first or last name" });
		}
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			// passwords do not match!
			return done(null, false, { message: "Incorrect password" });
		}
		return done(null, user);
	} catch (err) {
		return done(err);
	}
}

function serialUser(user, done) {
	done(null, user.id);
}

async function deserialUser(id, done) {
	try {
		const { rows } = await pool.query("SELECT * FROM members WHERE member_id = $1", [
			id,
		]);
		const user = rows[0];

		done(null, user);
	} catch (err) {
		done(err);
	}
}

function authenticate() {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/",
	});
}

async function passwordValidate(value, { req }) {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return value === req.body.password;
  }

module.exports = {
	localStrategy,
	serialUser,
	deserialUser,
  authenticate,
  passwordValidate,
};
