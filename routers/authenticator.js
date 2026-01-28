module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  }else{
    req.flash("error", "You must be logged in to view this page");
    res.redirect("/");
  }
} 

// module.exports.isAdmin = (req, res, next) => {
//   if (req.user.status === "Admin") {
//     next();
//   }else{
//     req.flash("error", "You must be an admin to view this page");
//     res.redirect("/");
//   }
// }