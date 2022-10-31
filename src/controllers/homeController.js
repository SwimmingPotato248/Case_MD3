// module.exports.homeController = (req, res) => {
//   // TODO: xử lí trang /, /home
//   // Hiển thị tất cả các post đã được đăng
//   // Các posts link đến /posts/:id
//   // Có form tạo post mới, POST lên /posts/create-098p,lr
//
//   res.end("Home Controller");
// };

const fs = require("fs");
const { getPost } = require("../models/post");
class PostRouting {
  static getHtmlPosts(posts, indexHtml) {
    let tbody = "";
    posts.map((post, index) => {
      tbody += `<tr style="text-align: center">
            <td>${index + 1}</td>
            <td>${post.content}</td>
            
            <td><a type="button" href="posts/edit/${
              post.id
            }" class="btn btn-danger">Edit</a></td>
            <td><a type="button" href="posts/delete/${
              post.id
            }" class="btn btn-danger">Delete</a></td>
        </tr>`;
    });
    indexHtml = indexHtml.replace("{posts}", tbody);
    return indexHtml;
  }
}
const fs = require("fs");
const server = require("../server");
const { Server } = require("socket.io");
module.exports.homeController = (req, res) => {
  // TODO: xử lí trang /, /home
  // Hiển thị tất cả các post đã được đăng
  // Các posts link đến /posts/:id
  // Có form tạo post mới, POST lên /posts/create

  fs.readFile("./src/views/home/home.html", "utf-8", (err, indexHTML) => {
    if (err) {
      console.log(err);
    } else {
      const io = new Server(server);
      const users = {};
      try {
        io.on("connection", socket => {
          socket.on("sendNotification", name => {
            console.log(name);
          });
          socket.on("disconnect", () => {
            socket.broadcast.emit("user-disconnected", users[socket.id]);
            delete users[socket.id];
          });
        });
      } catch (e) {
        console.log(e);
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(indexHTML);
      res.end();
    }
  });
};
