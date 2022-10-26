const url = require("url");
const { getPost } = require("../models/post");

module.exports.postController = async (req, res) => {
  const paths = url.parse(req.url).pathname.slice(1).split("/");
  const postId = paths[1];
  const post = await getPost(postId);
  if (!post) return res.end("Not found");
  console.log(post);
  res.end(`Post ${post.content}`);
};
