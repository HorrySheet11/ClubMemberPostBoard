const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/usersController");
const passport = require("passport");
const { body } = require("express-validator");
const { isAuth } = require("./authenticator");

userRouter.get("/", isAuth, userController.login);
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
		successRedirect: "/home",
		failureRedirect: "/",
	}),
);
userRouter.get('/home', isAuth, userController.home);
userRouter.get('/createPost', isAuth, userController.createPost);
userRouter.post('/createPost', isAuth, userController.createPostPost);

module.exports = userRouter;
