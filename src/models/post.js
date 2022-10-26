const connection = require("../utils/database");

module.exports.getPost = id => {
  const sql = `
    SELECT Post.*, User.username FROM Post
    JOIN User ON Post.user_id = User.id
    WHERE Post.id = ${id}
  `;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        reject();
      } else resolve(results[0]);
    });
  });
};
