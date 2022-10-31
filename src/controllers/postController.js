//router
const qs = require("qs");
const url = require("url");
const fs = require("fs");
const PostService = require("../models/post");
const createCommentSection = require("../utils/createCommentSection");

module.exports.postController = async (req, res) => {
  const path = url.parse(req.url).pathname;
  console.log(path);
  if (path === "/posts/create") {
    if (req.method === "GET") {
      fs.readFile("src/views/post/create.html", "utf-8", (err, indexHtml) => {
        if (err) {
          console.log(err);
        } else {
          res.writeHead(200, "text/html");
          res.write(indexHtml);
          res.end();
        }
      });
    } else {
      let postChunk = "";
      req.on("data", chunk => {
        postChunk += chunk;
      });
      req.on("end", async err => {
        if (err) {
          console.log(err);
        } else {
          let post = qs.parse(postChunk);
          await PostService.savePost(post);
          res.writeHead(301, { location: "/home" });
          res.end();
        }
      });
    }
  } else if (path.match(/\/posts\/edit\/\d*/)) {
    const id = url.parse(req.url).pathname.slice(1).split("/")[2];
    if (req.method === "GET") {
      fs.readFile(
        "src/views/post/edit.html",
        "utf-8",
        async (err, editHtml) => {
          if (err) {
            console.log(err);
          } else {
            let post = await PostService.findById(id);
            editHtml = editHtml.replace("{content}", post[0].content);
            res.writeHead(200, "text/html");
            res.write(editHtml);
            res.end();
          }
        }
      );
    } else {
      let postChunk = "";
      req.on("data", chunk => {
        postChunk += chunk;
      });
      req.on("end", async err => {
        if (err) {
          console.log(err);
        } else {
          let post = qs.parse(postChunk);
          await PostService.editPost(post, id);
          res.writeHead(301, { location: "/home" });
          res.end();
        }
      });
    }
  } else if (path.match(/\/posts\/delete\/\d*/)) {
    const id = url.parse(req.url).pathname.slice(1).split("/")[2];
    console.log(id);
    if (req.method === "GET") {
      fs.readFile("src/views/post/delete.html", "utf-8", (err, editHtml) => {
        if (err) {
          console.log(err);
        } else {
          res.writeHead(200, "text/html");
          res.write(editHtml);
          res.end();
        }
      });
    } else {
      let postChunk = "";
      req.on("data", chunk => {
        postChunk += chunk;
      });
      req.on("end", async err => {
        if (err) {
          console.log(err);
        } else {
          let post = qs.parse(postChunk);
          await PostService.delete(id);
          res.writeHead(301, { location: "/home" });
          res.end();
        }
      });
    }
  } else if (req.url.match(/^\/posts\/\d+\/?$/)) {
    const paths = url.parse(req.url).pathname.slice(1).split("/");
    const postId = parseInt(paths[1]);
    const post = await PostService.getPost(postId);
    const comments = await PostService.getComments(postId);
    if (!post) return res.end("Post not found");
    fs.readFile("src/views/post/post.html", "utf-8", (err, dataHtml) => {
      if (err) console.log(err);
      let postData = "";
      postData += `<div>${post.username}</div>`;
      postData += `<div>${post.created_at.toLocaleDateString()}</div>`;
      postData += `<div>${post.content}</div>`;
      dataHtml = dataHtml.replace("{post}", postData);
      let commentForm = fs.readFileSync(
        "src/views/post/commentForm.html",
        "utf-8"
      );
      dataHtml = dataHtml.replace("{commentModal}", commentForm);
      dataHtml = dataHtml.replace("{commentsCount}", comments.length);
      commentForm = commentForm.replace("{postId}", postId);
      mainComment = commentForm.replace("{commentId}", "null");
      dataHtml = dataHtml.replace("{commentForm}", mainComment);
      let commentBody = createCommentSection(comments, commentForm);
      dataHtml = dataHtml.replace("{comments}", commentBody);
      res.end(dataHtml);
    });
  } else if (req.url.match(/^\/posts\/create\/?$/)) {
    res.end("Create post");
  } else if (req.url === "/posts/comments" && req.method === "POST") {
    const user_id = 1;
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", async () => {
      body = qs.parse(body);
      await addComment(body, user_id);
      res.writeHead(301, { Location: `/posts/${body.postId}` });
      res.end();
    });
  } else res.end("Not found");
};
