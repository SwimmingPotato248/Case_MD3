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
      } else {
        resolve(results[0]);
      }
    });
  });
};

module.exports.getComments = id => {
  const sql = `
  SELECT Comment.*, User.username FROM Comment
  JOIN User ON Comment.user_id = User.id
  WHERE Comment.post_id = ${id}  
  `;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        reject();
      } else {
        resolve(results);
      }
    });
  });
};

module.exports.addComment = (comment, user_id) => {
  const { postId, commentId, content } = comment;
  const sql = `
    INSERT INTO Comment (post_id, parent_id, content, user_id) VALUES (${postId}, ${commentId}, '${content}', ${user_id})
  `;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        reject();
      } else {
        console.log("Done");
        resolve();
      }
    });
  });
};
