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
