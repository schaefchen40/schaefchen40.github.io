const express = require('express');
const request = require('request');
const fs = require('fs'); 
// const csv = require('csv-parser');
const csv = require("csvtojson");
const { json } = require('express');
const app = express();
const router = express.Router();
const path = __dirname + '/app/';
const port = 3000;


router.use(function (req,res,next) {
  console.log('/' + req.method + path + 'index.html');
  next();
});

app.use("/favicon.ico", express.static('public/img/favicon-day.ico')); 
app.use("/brandicon.ico", express.static('public/img/favicon.ico')); 
app.use("/darkicon.ico", express.static('public/img/cateyesnight.png')); 
app.use("/lighticon.ico", express.static('public/img/cateyesday.png')); 
app.use("/autoicon.ico", express.static('public/img/cateyesauto.png')); 


router.get('/', function(req,res){
  console.log('Request / recived');
  res.sendFile(path + 'index.html');
});

app.get('/data', function(req,res){
  console.log('Request /data recived');
    
  // var length = Object.keys(req.query).length;
  var url; 
  for (var key in req.query) {
    if (req.query.hasOwnProperty(key)) {
      // console.log(key + " -> " + req.query[key]);
      if(key == 'url'){
        url = req.query[key];
      }else{
        url = url + '&' + key + '=' + req.query[key];
      }
    }
  } 
  console.log(url);
  req.pipe(request(url)).pipe(res);
});

app.get('/conditions', function(req,res){
  console.log('Request /conditions recived');
  var file = path + '/data/conditions.json';
  res.sendFile(file);
});


function Sleep(milliseconds) {
 return new Promise(resolve => setTimeout(resolve, milliseconds));
}


app.get('/horizon', function(req,res){
  console.log('Request /horizon recived');
  var file;
  for (var key in req.query) {
    if (req.query.hasOwnProperty(key)) {
      console.log(key + " -> " + req.query[key]);
      if(req.query[key] == 'Hopfgarten'){
        console.log('in if Hopfgarten');
        file = path + 'data/shading_hopfgarten.csv';
      }else if(req.query[key] == 'Lermoos'){
        console.log('in if Lermoos');
        file = path + 'data/shading_lermoos.csv'; 
      }
    }
  }
  // ++++++ Variation des Ortes +++++++
  // +++++++++++ Lermoos +++++++++++
  // var file = path + 'data/shading_lermoos.csv'; 
  // ++++++++++ Hopfgarten +++++++++++
  // var file = path + 'data/shading_hopfgarten.csv'; 
  // ++++ Variation des Ortes Ende +++++

  console.log(path + file);

  var result;

  // Convert a csv file with csvtojson
  csv()
    .fromFile(file)
    .then((jsonArrayObj) =>{ //when parse finished, result will be emitted here.
      // console.log(jsonArrayObj)
      result = jsonArrayObj;

    })
    .then((ifFinished) => res.send(result));
  });

app.get('/icon', function(req,res){
  console.log('Request /icon recived');
  // var length = Object.keys(req.query).length;
  var urn;
  for (var key in req.query) {
    if (req.query.hasOwnProperty(key)) {
        if(key == 'urn'){
          urn = req.query[key];
        }else{
          console.log('No valid request given.');
        }
    }
  } 
  var file = path + 'img/' + urn;
  console.log('File: ' + file);
  res.sendFile(file);
});

app.get('/measurements', function(req,res){
  console.log('Request /measurements recived');
  res.sendFile(path + 'measurements.html');
});

app.get('/pv', function(req,res){
  console.log('Request /pv recived');
  res.sendFile(path + 'pv.html');
});

app.use(express.static(path));
//add the router
app.use('/', router);
app.listen(port, function () {
  console.log('Container listening on port 3000!');
  console.log(path);
  console.log(__dirname + '/public/img/favicon.ico');
});



