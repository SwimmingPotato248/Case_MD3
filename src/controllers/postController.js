//router
const qs = require('qs')
const url = require("url");
const fs = require("fs");
const PostService = require("../models/post");
module.exports.postController = (req, res) => {
  const path = url.parse(req.url).pathname
  console.log(path)
  if (path === "/posts/create") {
    if (req.method === "GET") {
      fs.readFile('/Users/quoctieunam/Documents/Case_MD3/views/post/create.html', 'utf-8', (err, indexHtml) => {
        if (err) {
          console.log(err);
        } else {
          res.writeHead(200,'text/html');
          res.write(indexHtml);
          res.end();
        }
      });
    }else{
      let postChunk =''
      req.on('data',chunk =>{
        postChunk +=chunk
      });
      req.on('end', async (err)=>{
        if(err){
          console.log(err);
        }else{
          console.log(postChunk)
          let post= qs.parse(postChunk);
          console.log(post)
          await PostService.savePost(post);
          res.writeHead(301, {'location': '/home'});
          res.end();
        }
      });
      }
  }


  else if (path.match(/\/posts\/edit\/\d*/)) {
    const id = url.parse(req.url).pathname.slice(1).split('/')[2]
    console.log(id)
    if(req.method === "GET"){
    fs.readFile('/Users/quoctieunam/Documents/Case_MD3/views/post/edit.html', 'utf-8', async (err, editHtml) => {
      if (err) {
        console.log(err);
      } else {
        let post = await PostService.findById(id);
        editHtml = editHtml.replace('{content}',post[0].content);
        res.writeHead(200, 'text/html');
        res.write(editHtml);
        res.end();
      }
    });
  }else{
      let postChunk =''
      req.on('data',chunk =>{
        postChunk += chunk
      });
      req.on('end', async (err)=>{
        if(err){
          console.log(err);
        }else{
          console.log(postChunk)
          let post= qs.parse(postChunk);
          console.log(post)
          await PostService.editPost(post,id);
          res.writeHead(301, {'location': '/home'});
          res.end();
        }
      });
    }
  }
  else if (path.match(/\/posts\/delete\/\d*/)) {
    const id = url.parse(req.url).pathname.slice(1).split('/')[2]
    console.log(id)
    if(req.method === "GET"){
      fs.readFile('/Users/quoctieunam/Documents/Case_MD3/views/post/delete.html', 'utf-8', (err, editHtml) => {
        if (err) {
          console.log(err);
        } else {
          res.writeHead(200, 'text/html');
          res.write(editHtml);
          res.end();
        }
      });
    }else{
      let postChunk =''
      req.on('data',chunk =>{
        postChunk += chunk
      });
      req.on('end', async (err)=>{
        if(err){
          console.log(err);
        }else{
          console.log(postChunk)
          let post= qs.parse(postChunk);
          console.log(post)
          await PostService.delete(id);
          res.writeHead(301, {'location': '/home'});
          res.end();
        }
      });
    }
  }
}

