const http = require("http");
const url = require("url");
const { authController } = require("./src/controllers/authController");
const { homeController } = require("./src/controllers/homeController");
const { postController } = require("./src/controllers/postController");
const { userController } = require("./src/controllers/userController");

const notFoundRouter = (req, res) => {
  res.end("404");
};

const routers = {
  home: homeController,
  posts: postController,
  users: userController,
  auth: authController,
  notFound: notFoundRouter,
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const paths = parsedUrl.pathname.slice(1).split("/");
  const current  = paths.shift();
  console.log(paths);
  if (current === "" || current === "home") {
    routers.home(req, res);
  } else if (routers[current]) {
    routers[current](req, res);
  } else {
    routers.notFound(req, res);
  }
});

server.listen(8080, () => {
  console.log("Server running on port 3000");
});