const query = require("../db/queries");
const bcrypt = require("bcrypt");

async function login(req, res) {
	res.render("index", {
		title: "Home",
		user: req.user,
	});
}

async function signUpGet(req, res) {
	res.render("sign-up-form", {
		title: "Sign Up",
	});
}

async function signUpPost(req, res, next) {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(req.body);
    await query.signUp(
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      req.body.status,
      hashedPassword
    )
		res.redirect("/");
	} catch (error) {
		console.error(error);
		next(error);
	}
}

async function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

async function home(req, res) {
  res.render("home", {
    title: "Home",
    user: req.user,
    posts: await query.getAllPostsAndAuthor(),
  });
}

async function createPost(req, res) {
  res.render("createPost", {
    title: "Create Post",
    user: req.user,
  });
}

async function createPostPost(req, res) {
  const add = await query.createPost(req.body.title, req.body.message, req.user.member_id);
  res.redirect('/home')
}

module.exports = {
	login,
  logout,
	signUpGet,
  signUpPost,
  home,
  createPost,
  createPostPost,
};
