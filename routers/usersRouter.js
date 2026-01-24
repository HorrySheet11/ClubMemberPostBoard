const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/usersController");
const passportController = require("../controllers/passportController");
const { body } = require("express-validator");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const pool = require("../db/pool");
const bcrypt = require("bcrypt");


passport.use(new LocalStrategy(passportController.localStrategy));


userRouter.get("/", userController.login);
userRouter.get("/sign-up", userController.signUpGet);
userRouter.post(
	"/sign-up",
	body("passwordConfirmation").custom(passportController.passwordValidator),
	userController.signUpPost,
);
userRouter.get("/log-out", userController.logout);
userRouter.post(
	"/log-in",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/",
	}),
);

passport.use(
	new LocalStrategy(async (firstname, lastname, email, password, done) => {
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
	}),
);

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


module.exports = userRouter;
