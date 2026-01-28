const pool = require("./pool");

async function signUp(firstname, lastname, email, status, password) {
	const result = await pool.query(
		"INSERT INTO members (firstname, lastname, email, status, password) VALUES ($1, $2, $3, $4, $5)",
		[firstname, lastname, email, status, password],
	);
	return result;
}

async function getAllPostsAndAuthor() {
	const {rows} = await pool.query(
		"select post_id, title, message, created, p.member_id, firstname, lastname from posts as p join members as m on m.member_id = p.member_id;",
	);
  console.log(rows);
	return rows;
}

async function createPost(title, message, member_id) {
  const result = await pool.query(
    "INSERT INTO posts (title, message, member_id) VALUES ($1, $2, $3)",
    [title, message, member_id],
  );
  return result;
}
module.exports = {
	signUp,
  getAllPostsAndAuthor,
  createPost,
};
