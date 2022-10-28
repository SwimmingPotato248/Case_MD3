const fs  = require("fs")
const http = require('http')


module.exports.homeController = (req, res) => {
  // TODO: xử lí trang /, /home
  // Hiển thị tất cả các post đã được đăng
  // Các posts link đến /posts/:id
  // Có form tạo post mới, POST lên /posts/create
  // Hiển thị các thông báo nhận được

  fs.readFile('./src/views/home.html','utf-8',(err, indexHTML) =>{
    if (err){
      console.log(err)
    }else {
      const { Server } = require("socket.io");

      const io = new Server({
        cors:{
          origin:"http://localhost:3000"
        }
      });

      const users = {}

      io.on("connection", (socket) => {

        socket.on('sendNotificationLike', notification => {

        })

        socket.on("disconnect",()=>{
          socket.broadcast.emit('user-disconnected', users[socket.id])
          delete users[socket.id]
        })
      });

      io.listen(5000);
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(indexHTML)
      res.end()
    }
  })
};
