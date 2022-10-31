// module.exports.homeController = (req, res) => {
//   // TODO: xử lí trang /, /home
//   // Hiển thị tất cả các post đã được đăng
//   // Các posts link đến /posts/:id
//   // Có form tạo post mới, POST lên /posts/create-098p,lr
//
//   res.end("Home Controller");
// };


const fs = require('fs');
const {getPost} = require("../models/post");
class PostRouting {
  static getHtmlPosts(posts, indexHtml) {
    let tbody = '';
    posts.map((post, index) => {
      tbody += `<tr style="text-align: center">
            <td>${index+1}</td>
            <td>${post.content}</td>
            
            <td><a type="button" href="posts/edit/${post.id}" class="btn btn-danger">Edit</a></td>
            <td><a type="button" href="posts/delete/${post.id}" class="btn btn-danger">Delete</a></td>
        </tr>`
    });
    indexHtml = indexHtml.replace('{posts}', tbody);
    return indexHtml;
  }
}
module.exports.homeController = (req, res) => {
  fs.readFile('/Users/quoctieunam/Documents/Case_MD3/views/index.html','utf-8',async (err, indexHtml)=>{
    if(err){
      console.log(err);
    }else{
      let posts = await getPost();
      indexHtml = PostRouting.getHtmlPosts(posts,indexHtml)
      res.writeHead(200,'text/html');
      res.write(indexHtml);
      res.end();
    }
  })
};





