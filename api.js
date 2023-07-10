const express = require("express");
const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


let port = 9000;
app.set('port',port);
app.set("view engine","jade");
app.use(express.json())
app.use(express.urlencoded({extended:false}));


app.get("/", function(req, res) {
  res.send('hi there');
});

app.listen(port, function() {
 console.log("Server started successfully");
});