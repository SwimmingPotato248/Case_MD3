const url = require("url");
const fs = require("fs");
const qs = require("qs");
const { getPost, getComments, addComment } = require("../models/post");
const createCommentSection = require("../utils/createCommentSection");

module.exports.postController = async (req, res) => {
  if (req.url.match(/^\/posts\/\d+\/?$/)) {
    const paths = url.parse(req.url).pathname.slice(1).split("/");
    const postId = parseInt(paths[1]);
    const post = await getPost(postId);
    const comments = await getComments(postId);
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
      console.log(comments);
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
