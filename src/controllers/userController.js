const fs = require("fs");
const qs = require("qs");
const UserService = require("../models/user");
const formidable = require("formidable");
const url = require("url");

module.exports.userController = (req, res) => {
  const path = url.parse(req.url).pathname;
  console.log(path);
  // upload Avt
  // Lưu ý lúc lưu tên ảnh phải sửa cho tên ảnh viết liền nhau (không có khoảng trống)
  if (path.match(/\/users\/\d+\/uploadAvt/)) {
    const id = url.parse(req.url).pathname.slice(1).split("/")[1];
    if (req.method === "GET") {
      fs.readFile(
        "src/views/profile/uploadAvtProfile.html",
        "utf-8",
        (err, uploadAvtHtml) => {
          if (err) {
            console.log(err);
          } else {
            res.writeHead(200, "text/html");
            res.write(uploadAvtHtml);
            res.end();
          }
        }
      );
    } else {
      const form = formidable({ multiples: true });
      form.parse(req, async function (err, fields, files) {
        if (err) {
          console.log(err);
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        const dataImgInput = files.multipleFiles;
        let tmpPath = dataImgInput.filepath;

        let newPath = __dirname + "/uploads/" + dataImgInput.originalFilename;

        // console.log('ảnh' + newPath);
        // thêm avt vào database
        let profile = await UserService.findById(id);
        await UserService.upLinkAvt(
          profile,
          `../controllers/uploads/${dataImgInput.originalFilename}`,
          `${id}`
        );

        fs.readFile(newPath, err => {
          if (err) {
            fs.copyFile(tmpPath, newPath, err => {
              if (err) throw err;
            });
          }
        });
        res.writeHead(301, { location: `/users/${id}` });
        res.write("File uploaded and moved!");
        res.end();
      });
    }
  }

  // Hiển thị Profile
  else if (path.match(/\/users\/\d+/)) {
    const id = url.parse(req.url).pathname.slice(1).split("/")[1];
    fs.readFile(
      "src/views/profile/showProfile.html",
      "utf-8",
      async (err, showProfileHtml) => {
        if (err) {
          console.log(err);
        } else {
          let profile = await UserService.findById(id);
          if (!profile.length) {
            res.writeHead(302, { Location: `/users/profile/${id}/create` });
            res.end();
          } else {
            const formattedDate = new Date(profile[0].date_of_birth)
              .toISOString()
              .split("T")[0];
            showProfileHtml = showProfileHtml.replace(
              "{date_of_birth}",
              formattedDate
            );
            showProfileHtml = showProfileHtml.replace(
              "{img}",
              profile[0].avatar
            );
            showProfileHtml = showProfileHtml.replace("{bio}", profile[0].bio);
            showProfileHtml = showProfileHtml.replace(
              "{name}",
              profile[0].name
            );
            showProfileHtml = showProfileHtml.replace("{userId}", id);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(showProfileHtml);
            res.end();
          }
        }
      }
    );
  }

  //Tạo Profile
  else if (path.match(/\/users\/profile\/\d+\/create/)) {
    if (req.method === "GET") {
      fs.readFile(
        "src/views/profile/createProfile.html",
        "utf-8",
        (err, createProfileHtml) => {
          if (err) {
            console.log(err);
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(createProfileHtml);
            res.end();
          }
        }
      );
    } else {
      const id = url.parse(req.url).pathname.slice(1).split("/")[2];
      let profileChunk = "";
      req.on("data", chunk => {
        profileChunk += chunk;
      });
      req.on("end", async err => {
        if (err) {
          console.log(err);
        } else {
          let profile = qs.parse(profileChunk);
          console.log(profile);
          await UserService.createProfile(profile, id);
          res.writeHead(301, { location: "/home" });
          res.end();
        }
      });
    }
  }

  // Edit Profile
  else if (path.match(/\/users\/profile\/\d*\/edit/)) {
    const id = url.parse(req.url).pathname.slice(1).split("/")[2];
    console.log("id ở edit " + id);
    if (req.method === "GET") {
      fs.readFile(
        "src/views/profile/editProfile.html",
        "utf-8",
        async (err, editProfileHtml) => {
          if (err) {
            console.log(err);
          } else {
            let profile = await UserService.findById(id);
            const formattedDate = new Date(profile[0].date_of_birth)
              .toISOString()
              .split("T")[0];
            editProfileHtml = editProfileHtml.replace(
              "{name}",
              profile[0].name
            );
            editProfileHtml = editProfileHtml.replace(
              "{date_of_birth}",
              formattedDate
            );
            editProfileHtml = editProfileHtml.replace("{bio}", profile[0].bio);
            editProfileHtml = editProfileHtml.replace(
              "{img}",
              profile[0].avatar
            );
            res.writeHead(200, "text/html");
            res.write(editProfileHtml);
            res.end();
          }
        }
      );
    } else {
      let profileChunk = "";
      req.on("data", chunk => {
        profileChunk += chunk;
      });
      req.on("end", async err => {
        if (err) {
          console.log(err);
        } else {
          let profile = qs.parse(profileChunk);
          await UserService.editProfile(profile, id);
          res.writeHead(301, { Location: `/users/${id}/uploadAvt` });
          res.end();
        }
      });
    }
  }

  // TODO: Hiển thị profile người dùng hiện đang đăng nhập
  // Nếu chưa có profile chuyển đến /users/profile/create
  // Sửa profile ở /users/profile/edit
};
