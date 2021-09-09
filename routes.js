const e = require("express");

exports.upload = function (req, res) {
    let message = '';
    if (req.method == "POST") {
        var data = req.body,
            files = req.files.uploaded_image;
        if (!files) {
            return res.status(400).send('No files were uploaded.');
        }
        console.log("start")
        if (Array.isArray(files)) {
            files.forEach(async (file, i) => {
                setTimeout(function () {
                    uploadImgToDB(req, res, file);
                }, 200 * i)
                //    let result = await 
                //    console.log(result);
            });
            res.redirect('/gallery')
        } else {
            uploadImgToDB(req, res, files);
            res.redirect('/gallery');
        }

    } else {
        let sql = 'SELECT * FROM years';
        db.query(sql, (err, result) => {
            result.sort((a, b) => a.name > b.name ? -1 : 1);
            res.render('upload.ejs', {
                title: 'Загрузка',
                years: result,
                active:'upload'
            })
        })
    }
};

uploadImgToDB = async function (req, res, file) {
    let mimetype
    if (file.name.lastIndexOf(".") > 0) {
        mimetype = file.name.substr(file.name.lastIndexOf("."), file.name.length);
    }
    let date = Date.now().toString();
    let fileName = date + mimetype;
    console.log(fileName);
    var data = req.body,
        img_name = fileName,
        description = data.description,
        year = req.body.year;

    console.log(data)
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
        file.mv('public/images/upload_images/' + fileName, async function (err) {
            if (err) {
                return res.status(500).send(err);
            } else {
                var sql = "INSERT INTO `users_image`(`description` ,`image`,`yearID` ) VALUES (?,?,?)";
                var query = await db.promise().query(sql, [description, img_name, year], function (err, result) {
                    if (err) {
                        console.log("not fine" + err);
                    } else {
                        console.log("DB Fine");
                    }
                });
                //console.log(query);
            }
        });
        return true;
    }
    return false;
}





exports.index = function (req, res) {
    res.render('index.ejs', {
        title: 'Главная страница',
        active: 'main'
    })
}


exports.gallery = function (req, res) {
    var id = req.params.id;
    if (!id) {
        var sql = "SELECT * FROM years";
        db.query(sql, (err, result) => {
            result.sort((a, b) => a.name > b.name ? -1 : 1);
            res.render('gallery.ejs', {
                title: 'Gallery',
                years: result,
                users: 0,
                active: 'gallery'

            });
        });
    } else {
        let lsq = "select * from users_image where `yearId`='" + id + "'and `chekup` = 1";
        db.query(lsq, (err, result) => {
            result.sort((a, b) => a.id > b.id ? -1 : 1);
            res.render('gallery.ejs', {
                title: 'Gallery',
                years: 0,
                users: result,
                active:'gallery'
            });
        })
    }
}

exports.testing = function (req, res) {
    var sql = "SELECT * FROM users_image";
    db.query(sql, (err, result) => {
        res.render('testing.ejs', {
            title: 'testing',
            users: result
        })
    })

}

exports.deletePicture = function (req, res) {
    let id = req.params.id;
    let sql = "DELETE FROM users_image WHERE `id` = (?)"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Succes')
        }
    })
    res.send(true)
}

exports.appendPicture = function (req, res) {
    let descr = req.body.descr
    let id = req.params.id;
    let sql = "UPDATE `users_image` set `chekup` = 1 , `description` = (?) WHERE `id` = (?)"
    db.query(sql, [descr, id], (err, result) => {
        if (err) {
            console.log('чел ты в говне:' + err)
        } else {
            console.log('Succes')
        }
    })
    res.send(true)
}

exports.login = function (req, res) {
    let message = '';
    if (req.method == "POST") {
        let login = req.body.login;
        let pass = req.body.password;
        let data = req.body

        console.log(data)
        sql = 'SELECT * from admin where `login`=(?) and `pass`=(?)';
        db.query(sql, [login, pass], (err, result) => {
            console.log(result)
            if (result.length === 0) {
                message = "Неправилный логин или пароль"
                res.render('login.ejs', {
                    title: "login",
                    message: message,
                    active:'active'
                })
            } else {
                console.log('kek')
                res.write("<html><body><script type='text/javascript'>localStorage.setItem('isAdmin'," + true + ");window.location.href =`/admin`;</script></body></html>");
            }
        })
    } else {
        res.render('login', {
            title: "Login",
            message: message,
            active:'login'
        })
    }

}

exports.admin = function (req, res) {
    if (req.method == "POST") {
        console.log(req.method)
        // let login = req.body.login;
        // let  pass = req.body.pass;
        // console.log(login,pass)
        // res.status(400)
    } else {
        let sql = "SELECT * FROM `users_image` WHERE `chekup` =0"
        db.query(sql, (err, result) => {
            result.sort((a, b) => a.id > b.id ? -1 : 1);
            if (err) {
                res.render('admin.ejs', {
                    title: 'admin',
                    pictures: 0,
                    active:'admin'
                })
            } else {
                res.render('admin.ejs', {
                    title: 'admin',
                    pictures: result,
                    active:'admin'
                })
            }


        })

    }

}

exports.uploadYear = function (req, res) {
    let year = req.body.year,
        file = req.files.uploaded_image;
    let mimetype
    if (file.name.lastIndexOf(".") > 0) {
        mimetype = file.name.substr(file.name.lastIndexOf("."), file.name.length);
    }
    let date = Date.now().toString();
    let fileName = date + mimetype;
    console.log(fileName)
    res.render(`admin.ejs`, {
        title: 'Admin',
        pictures:0,
        active: 'admin'
    });
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
        file.mv('public/images/year_image/' + fileName, async function (err) {
            if (err) {
                return res.status(500).send(err);
            } else {
                var sql = "INSERT INTO `years`(`name` ,`img`) VALUES (?,?)";
                var query = await db.promise().query(sql, [year, fileName], function (err, result) {
                    if (err) {
                        console.log("not fine" + err);
                    } else {
                        console.log("DB Fine");
                    }
                });

            }
        });
        return true;
    }
}

exports.contacts = function (req, res) {
    res.render('contacts.ejs', {
        title: 'Контакты',
        active:'contacts'
    })
};