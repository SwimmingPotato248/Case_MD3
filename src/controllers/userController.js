const fs = require("fs");
const qs = require("qs");
const UserService = require("../models/user");
const formidable = require('formidable');
const url = require("url");

module.exports.userController = (req, res) => {
    const path = url.parse(req.url).pathname

    // upload Avt
    // Lưu ý lúc lưu tên ảnh phải sửa cho tên ảnh viết liền nhau (không có khoảng trống)
    if (path.match(/\/users\/\d*\/uploadAvt/)) {
        const id = url.parse(req.url).pathname.slice(1).split('/')[1]
        if (req.method === 'GET') {
            fs.readFile('C:\\Users\\Iris\\WebstormProjects\\MD3\\CaseMD3\\Case_MD3\\src\\viewProfile\\uploadAvtProfile.html', "utf-8", (err, uploadAvtHtml) => {
                if (err) {
                    console.log(err);
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(uploadAvtHtml);
                    res.end();
                }
            })

        } else {

            const form = formidable({multiples: true});
            form.parse(req, async function (err, fields, files) {
                if (err) {
                    console.log(err);
                }
                res.writeHead(200, {"Content-Type": "application/json"});
                const dataImgInput = files.multipleFiles;
                let tmpPath = dataImgInput.filepath;

                let newPath = __dirname + "/uploads/" + dataImgInput.originalFilename;
                console.log('tmpPath', tmpPath)
                console.log('newPath', newPath)


                // console.log('ảnh' + newPath);
                // thêm avt vào database
                let profile = await UserService.findById(id);
                await UserService.upLinkAvt(profile,`../controllers/uploads/${dataImgInput.originalFilename}`,`${id}`)

                console.log('link ảnh ', dataImgInput.originalFilename);

                fs.readFile(newPath, (err) => {
                    if (err) {
                        fs.copyFile(tmpPath, newPath, (err) => {
                            if (err) throw err;
                        });
                    }
                });
                res.writeHead(301, {'location': `/users/${id}`});
                res.write('File uploaded and moved!');
                res.end();
            });
        }
    }


    // Hiển thị Profile
    else if (path.match(/\/users\/\d+/)) {
            const id = url.parse(req.url).pathname.slice(1).split('/')[1]
            fs.readFile('C:\\Users\\Iris\\WebstormProjects\\MD3\\CaseMD3\\Case_MD3\\src\\viewProfile\\showProfile.html', 'utf-8', async (err, createProfileHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    let profile = await UserService.findById(id);
                    const formattedDate = new Date(profile[0].date_of_birth).toISOString().split('T')[0];
                    createProfileHtml = createProfileHtml.replace('{date_of_birth}', formattedDate);
                    createProfileHtml = createProfileHtml.replace('{img}', profile[0].avatar);
                    console.log(profile[0].avatar)
                    createProfileHtml = createProfileHtml.replace('{bio}', profile[0].bio);
                    createProfileHtml = createProfileHtml.replace('{name}', profile[0].name)
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(createProfileHtml);
                    res.end();
                }
            })
        }


    // Tạo Profile
        // else if (path === "/users/profile/create") {
        //     if (req.method === 'GET') {
        //         fs.readFile('C:\\Users\\Iris\\WebstormProjects\\MD3\\CaseMD3\\Case_MD3\\src\\viewProfile\\creatProfile.html', 'utf-8', (err, createProfileHtml) => {
        //             if (err) {
        //                 console.log(err)
        //             } else {
        //                 res.writeHead(200, {'Content-Type': 'text/html'});
        //                 res.write(createProfileHtml);
        //                 res.end();
        //             }
        //         })
        //     } else {
        //         let profileChunk = '';
        //         req.on('data', chunk => {
        //             profileChunk += chunk
        //         });
        //         req.on('end', async (err) => {
        //             if (err) {
        //                 console.log(err);
        //             } else {
        //                 let profile = qs.parse(profileChunk);
        //                 await UserService.creatProfile(profile);
        //                 res.writeHead(301, {'location': '/home'});
        //                 res.end();
        //             }
        //         });
        //     }
        // }


// Edit Profile
    else if (path.match(/\/users\/profile\/edit\/\d*/)) {
        const id = url.parse(req.url).pathname.slice(1).split('/')[3]
        console.log('id ở edit ' + id);
        if (req.method === "GET") {
            fs.readFile('C:\\Users\\Iris\\WebstormProjects\\MD3\\CaseMD3\\Case_MD3\\src\\viewProfile\\editProfile.html', 'utf-8', async (err, editProfileHtml) => {
                if (err) {
                    console.log(err);
                } else {
                    let profile = await UserService.findById(id);
                    const formattedDate = new Date(profile[0].date_of_birth).toISOString().split('T')[0];
                    editProfileHtml = editProfileHtml.replace('{name}', profile[0].name);
                    editProfileHtml = editProfileHtml.replace('{date_of_birth}', formattedDate);
                    editProfileHtml = editProfileHtml.replace('{bio}', profile[0].bio);
                    editProfileHtml = editProfileHtml.replace('{img}', profile[0].avatar);
                    res.writeHead(200, 'text/html');
                    res.write(editProfileHtml);
                    res.end();
                }
            })
        } else {
            let profileChunk = '';
            req.on('data', chunk => {
                profileChunk += chunk
            });
            req.on('end', async (err) => {
                if (err) {
                    console.log(err);
                } else {
                    let profile = qs.parse(profileChunk);
                    await UserService.editProfile(profile, id);
                    res.writeHead(301, {'Location': `/users/${id}/uploadAvt`});
                    res.end();
                }
            });
        }
    }

// TODO: Hiển thị profile người dùng hiện đang đăng nhập
// Nếu chưa có profile chuyển đến /users/profile/create
// Sửa profile ở /users/profile/edit
}




