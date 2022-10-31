//service
const connection = require("../utils/database");

class PostService {
  static savePost(Post) {
    return new Promise((resolve, reject) => {
      connection.query(
        `insert into Post(user_id,content)
                              VALUES (${Post.user_id},'${Post.content}')`,
        (err, posts) => {
          if (err) {
            reject(err);
          } else {
            console.log("Create Success !!!");
            resolve(posts);
          }
        }
      );
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      connection.query(`select * from Post where id = ${id}`, (err, posts) => {
        if (err) {
          reject(err);
        } else {
          console.log("Create Success !!!");
          resolve(posts);
        }
      });
    });
  }

  static editPost(post, id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `update Post set content ='${post.content}'where id=${id}`,
        (err, posts) => {
          if (err) {
            reject(err);
          } else {
            console.log("edit Success !!!");
            resolve(posts);
          }
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      connection.query(`delete from Post where id=${id}`, (err, posts) => {
        if (err) {
          reject(err);
        } else {
          console.log("delete Success !!!");
          resolve(posts);
        }
      });
    });
  }
}

module.exports = PostService;
module.exports.getPost = () => {
  const sql = `SELECT * FROM Post`;
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, posts) => {
      if (err) {
        console.log(err);
        reject();
      } else resolve(posts);
    });
  });
};

// module.exports.savePost= post =>{
//     const sql= `insert into Post(content)values ('${post.content}')`;
//     return new Promise((resolve, reject) => {
//         connection.query(sql, (err, posts) => {
//             if (err) {
//                 console.log(err);
//                 reject();
//             } else resolve(posts);
//         });
//     });
// }

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
