const pool = require("./pool");

async function signUp(firstname, lastname, email, status, password) {
  const result = await pool.query("INSERT INTO members (firstname, lastname, email, status, password) VALUES ($1, $2, $3, $4, $5)", [
			firstname,
      lastname,
      email,
      status,
			password,
		]);
  return result;
}

module.exports = {
  signUp,
};

