const connection = require("../utils/database");

class UserService {
  static getSignUpUser() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT *
                              FROM User`,
        (err, creatSignUp) => {
          if (err) {
            reject(err);
          } else {
            resolve(creatSignUp);
          }
        }
      );
    });
  }

  static saveDataUser(userdata) {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO User (username, password)
                              VALUES ('${userdata.name}', '${userdata.password}')`,
        (err, dataUser) => {
          if (err) {
            reject(err);
          } else {
            console.log(`---Save Success---`);
            resolve(dataUser);
          }
        }
      );
    });
  }

  static checkCountSignUpUser(name) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM User WHERE username = "${name}"`,
        (err, checkUser) => {
          if (err) {
            reject(err);
          } else {
            resolve(checkUser);
          }
        }
      );
    });
  }
  static checkLogin(name, password) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT *
                              FROM User
                              WHERE username = "${name}" && password = "${password}"`,
        (err, checkLogin) => {
          if (err) {
            reject(err);
          } else {
            resolve(checkLogin);
          }
        }
      );
    });
  }
}

module.exports = UserService;
// UserService.getSignUpUser();
