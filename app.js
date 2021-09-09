const express = require('express'),
      bodyParser = require('body-parser'),
      mysql2 = require('mysql2'),
      routes = require('./routes'),
      fileUpload = require('express-fileupload'),
      path = require('path'),
      fs = require('fs');

const app = express();
const connection = mysql2.createConnection({
    host:"localhost",
    user:'root',
    password:'password',
    database:'pictures'

})
connection.connect();

global.db = connection;


app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.get('/', routes.index)
app.get('/upload', routes.upload);//call for main index page
app.post('/upload', routes.upload,);//call for signup post 
app.get('/gallery', routes.gallery );
app.get('/login', routes.login );
app.post('/login', routes.login );
app.get('/admin', routes.admin );
app.post('/admin', routes.admin );
app.delete('/picture/delete/:id', routes.deletePicture)
app.put('/picture/append/:id', routes.appendPicture)
app.get('/gallery/:id', routes.gallery);
app.get('/contacts', routes.contacts);
app.post('/uploadYear', routes.uploadYear);

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })
app.listen(80,()=>{
    console.log("Запущено");
})