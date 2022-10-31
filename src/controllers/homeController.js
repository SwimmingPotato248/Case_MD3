// // const fs = require("fs");
// // const { getPost } = require("../models/post");
// // class PostRouting {
// //   static getHtmlPosts(posts, indexHtml) {
// //     let tbody = "";
// //     posts.map((post, index) => {
// //       tbody += `<tr style="text-align: center">
// //             <td>${index + 1}</td>
// //             <td>${post.content}</td>

// //             <td><a type="button" href="posts/edit/${
// //               post.id
// //             }" class="btn btn-danger">Edit</a></td>
// //             <td><a type="button" href="posts/delete/${
// //               post.id
// //             }" class="btn btn-danger">Delete</a></td>
// //         </tr>`;
// //     });
// //     indexHtml = indexHtml.replace("{posts}", tbody);
// //     return indexHtml;
// //   }
// // }
// const fs = require("fs");
// const server = require("../server");
// const { Server } = require("socket.io");
// module.exports.homeController = (req, res) => {
//   fs.readFile("./src/views/home/home.html", "utf-8", (err, indexHTML) => {
//     if (err) {
//       console.log(err);
//     } else {
//       const io = new Server(server);
//       const users = {};
//       try {
//         io.on("connection", socket => {
//           socket.on("sendNotification", name => {
//             console.log(name);
//           });
//           socket.on("disconnect", () => {
//             socket.broadcast.emit("user-disconnected", users[socket.id]);
//             delete users[socket.id];
//           });
//         });
//       } catch (e) {
//         console.log(e);
//       }

//       res.writeHead(200, { "Content-Type": "text/html" });
//       res.write(indexHTML);
//       res.end();
//     }
//   });
// };

const fs = require("fs");
const { getAllPost } = require("../models/post");
class PostRouting {
  static getHtmlPosts(posts, indexHtml) {
    let postBody = "";
    const postCard = fs.readFileSync("src/views/home/postCard.html", "utf-8");
    posts.map((post, index) => {
      let singlePost = postCard.replace("{username}", post.username);
      singlePost = singlePost.replace("{content}", post.content);
      singlePost = singlePost.replace(
        "{created_at}",
        new Date(post.created_at).toLocaleString()
      );
      singlePost = singlePost.replace("{postId}", post.id);
      postBody += singlePost;
    });
    indexHtml = indexHtml.replace("{posts}", postBody);
    return indexHtml;
  }
}
module.exports.homeController = (req, res) => {
  fs.readFile("src/views/home/home.html", "utf-8", async (err, indexHtml) => {
    if (err) {
      console.log(err);
    } else {
      let posts = await getAllPost();
      indexHtml = PostRouting.getHtmlPosts(posts, indexHtml);
      res.writeHead(200, "text/html");
      res.write(indexHtml);
      res.end();
    }
  });
};
