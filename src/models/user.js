const connection = require("../utils/database");
const mysql = require("mysql2");
const { resolve } = require("url");

class UserService {
  static getHtmlProfile(Profile, profileHtml) {
    let tbody = "";
    profileHtml = profileHtml.replace("{profile}", tbody);
    return profileHtml;
  }

  // upload Avt
  static upLinkAvt(Profile, img, id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `update Profile
                              set avatar = '${img}'
                              where id = ${id}`,
        (err, Profile) => {
          if (err) {
            reject(err);
          } else {
            console.log("Edit Success !!!");
            resolve(Profile);
          }
        }
      );
    });
  }

  static getUser() {
    return new Promise((resolve, reject) => {
      connection.query(
        `select *
                              from Profile`,
        (err, Profile) => {
          if (err) {
            reject(err);
          } else {
            resolve(Profile);
          }
        }
      );
    });
  }

  static findById(id) {
    const sql = `select * from Profile
        where user_id = ${id}`;
    console.log(sql);
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, Profile) => {
        if (err) {
          reject(err);
        } else {
          console.log(Profile);
          resolve(Profile);
        }
      });
    });
  }

  static createProfile(Profile, id) {
    const sql = `INSERT INTO Profile (user_id, name, date_of_birth, bio) VALUES (${id}, "${Profile.name}", "${Profile.date_of_birth}", "${Profile.bio}")`;
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, Profiles) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(Profiles);
          console.log("Creat profile success !!!");
        }
      });
    });
  }

  static editProfile(Profile, id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `update Profile
                              set name          = '${Profile.name}',
                                  date_of_birth = '${Profile.date_of_birth}',
                                  bio           = '${Profile.bio}'
                              where id = ${id}`,
        (err, Profile) => {
          if (err) {
            reject(err);
          } else {
            console.log("Edit Success !!!");
            resolve(Profile);
          }
        }
      );
    });
  }
}

module.exports = UserService;

// module.exports.getUser = (id) => {
//     const sql = `
//         SELECT User.*, User.username
//         FROM User
// --     JOIN User ON Post.user_id = User.id
//         WHERE User.id = ${id}
//     `;
//     return new Promise((resolve, reject) => {
//         connection.query(sql, (err, results) => {
//             if (err) {
//                 console.log(err);
//                 reject();
//             } else resolve(results[0]);
//         });
//     });
// };

// module.exports.getUser = (id) => {
//     const sql = `
//         SELECT User.*, User.username
//         FROM User
// --     JOIN User ON Post.user_id = User.id
//         WHERE User.id = ${id}
//     `;
//     return new Promise((resolve, reject) => {
//         connection.query(sql, (err, results) => {
//             if (err) {
//                 console.log(err);
//                 reject();
//             } else resolve(results[0]);
//         });
//     });
// };
