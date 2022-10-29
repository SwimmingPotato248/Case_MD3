const http = require("http");
const url = require("url");
const { authController } = require("./controllers/authController");
const { homeController } = require("./controllers/homeController");
const { postController } = require("./controllers/postController");
const { userController } = require("./controllers/userController");
const fs = require('fs');
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

let mimeTypes = {
  'jpg' : 'image/ipg',
  'jpeg' : 'image/ipg',
  'png' : 'image/png',
  'js' : 'text/javascript',
  'css' :'text/css',
  'svg' : 'image/svg+xml',
  'ttf' : 'font/ttf',
  'woff' : 'font/woff',
  'woff2' : 'font/woff2',
  'eot' : 'application/vnd.ms-fontobject'
}
//
// const server = http.createServer((req, res) => {
//   const parsedUrl = url.parse(req.url);
//   const paths = parsedUrl.pathname.slice(1).split("/");
//   const current = paths.shift();
//   console.log(paths);
//   if (current === "" || current === "home") {
//     routers.home(req, res);
//   } else if (routers[current]) {
//     routers[current](req, res);
//   } else {
//     routers.notFound(req, res, +paths[2]);
//   }
// });
//-------------------------------------------test

const server = http.createServer((req, res) => {
  let urlPath = url.parse(req.url).pathname;
  const filesDefences = urlPath.match(/\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot|\.jpeg/);
  if(filesDefences){
    const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
    res.writeHead(200,{'Content-Type': extension});
    fs.createReadStream(__dirname + req.url).pipe(res)
  }else {
    const parsedUrl = url.parse(req.url);
  const paths = parsedUrl.pathname.slice(1).split("/");
  const current = paths.shift();
  console.log(paths);
  if (current === "" || current === "home") {
    routers.home(req, res);
  } else if (routers[current]) {
    routers[current](req, res);
  } else {
    routers.notFound(req, res, +paths[2]);
  }}
})

// server.listen(8080,()=>{
//   console.log("Server running on port 8080")
// })

//------------------------------------------------test
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
