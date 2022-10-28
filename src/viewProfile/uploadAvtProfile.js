const http = require("http");
const formidable = require("formidable");
const fs = require("fs");
const viewFormUpload = fs.readFileSync("./views/viewUploadForm.html");

http.createServer(function (req, res) {
    if (req.url === "/upload" && req.method === "POST") {
        const form = formidable({multiples: true});
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log(err);
            }
            res.writeHead(200, {"Content-Type": "application/json"});

            const dataImgInput = files.multipleFiles;
            if(!dataImgInput.length){
                let tmpPath = dataImgInput.filepath;
                let newPath = __dirname + "/uploads/" + dataImgInput.originalFilename;

                console.log(dataImgInput.originalFilename) // ảnh !!!!!!!!!!!!

                fs.readFile(newPath, (err) => {
                    if (err) {
                        fs.copyFile(tmpPath, newPath, (err) => {
                            if (err) throw err;
                        });
                    }
                });
            } else {
                for (const e of dataImgInput) {
                    let tmpPath = e.filepath;
                    let newPath = __dirname + "/uploads/" + e.originalFilename;
                    fs.readFile(newPath, (err) => {
                        if (err) {
                            fs.copyFile(tmpPath, newPath, (err) => {
                                if (err) throw err;
                            });
                        }
                    });
                }
            }
        });
        res.end();
    } else {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(viewFormUpload);
        res.end();
    }
}).listen(8080);