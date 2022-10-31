const fs = require("fs");
const qs = require("qs");
const url = require("url");
const alert = require("alert");

const UserService = require("../models/auth");

module.exports.authController = (req, res) => {
  const path = url.parse(req.url).pathname;
  if (path === "/auth" || path === "/auth/login") {
    if (req.method === "GET") {
      fs.readFile("./src/views/index/index.html", "utf-8", (err, loginHtml) => {
        if (err) {
          console.log(err);
        }
        res.writeHead("200", "text/html");
        res.write(loginHtml);
        res.end();
      });
    } else {
      let userChunk = "";
      req.on("data", chunk => {
        userChunk += chunk;
      });
      req.on("end", async err => {
        if (err) {
          console.log(err);
        } else {
          let userInformation = qs.parse(userChunk);
          console.log({ userInformation });
          let userdata = await UserService.checkLogin(
            userInformation.name,
            userInformation.password
          );
          if (userdata.length < 1) {
            alert("--Tài khoản đăng ký với đăng nhập không khớp--");
          } else {
            res.writeHead(301, { Location: "/home" });
            res.end();
          }
        }
      });
    }
  }

  if (path === "/auth/signup") {
    if (req.method === "GET") {
      fs.readFile("src/views/signUp.html", "utf-8", (err, signUpHtml) => {
        if (err) {
          console.log(err);
        }
        res.writeHead("200", "text/html");
        res.write(signUpHtml);
        res.end();
      });
    } else {
      let userChunk = "";
      req.on("data", chunk => {
        userChunk += chunk;
      });
      req.on("end", async err => {
        if (err) {
          console.log(err);
        } else {
          let userInformation = qs.parse(userChunk);
          let user = await UserService.checkCountSignUpUser(
            userInformation.name
          );
          if (user.length >= 1) {
            alert("--Tài khoản đã tồn tại--");
            res.writeHead(301, { location: "/auth/signup" });
            res.end();
          } else {
            await UserService.saveDataUser(userInformation);
          }
          res.writeHead(301, { location: "/auth/login" });
          res.end();
        }
      });
    }
  }

  if (path === "/auth/home") {
    fs.readFile("./src/views/home/home.html", "utf-8", (err, createHtml) => {
      if (err) {
        console.log(err);
      } else {
        res.writeHead("200", "text/html");
        res.write(createHtml);
        res.end();
      }
    });
  }
  // TODO: xử lí /signin, /signup
  // signup check username unique, mã hoá password bằng argon2

  // signin check thông tin đăng nhập và gửi cookie chứa thông tin username
  // khi đăng nhập thành công
};
