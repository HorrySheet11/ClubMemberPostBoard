const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/usersController");
const passport = require("passport");
const { body } = require("express-validator");

userRouter.get("/", userController.login);
userRouter.get("/sign-up", userController.signUpGet);
userRouter.post(
	"/sign-up",
	body("passwordConfirmation").custom((value, { req }) => {
		return value === req.body.password;
	}),
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

module.exports = userRouter;
