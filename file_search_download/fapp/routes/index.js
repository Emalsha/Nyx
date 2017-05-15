var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test/:id', function(req, res, next) {
  res.render('test', {output: req.params.id});
});
router.post('/test/submit', function(req, res, next) {
  var id =req.body.id;
  var fs = require('fs');
  var dir = '../'+id;
  var c="folder "+id+"created ";
  var n="folder "+id+" exists ";
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);

    res.redirect('/test/'+c);
    // console.log("done");
    } else{

      res.redirect('/test/'+n);
	  //  console.log("exists");
   };

});
//view all files in the folder
router.get('/search', function(req, res, next) {
  const testFolder = '../';
  const fs = require('fs');
  fs.readdir(testFolder, (err, files) => {
    res.redirect('/file/'+files);
  })

});


router.post('/search/submit', function(req, res, next) {
  var id =req.body.id;
  const testFolder = '../'+id;
  const fs = require('fs');
  fs.readdir(testFolder, (err, files) => {
    res.redirect('/file/'+files);
  })

});




router.get('/file/:id', function(req, res, next) {
  res.render('file', {output: req.params.id});
});


router.post('/file/submit', function(req, res, next) {

  var id =req.body.id;

  //var fs = require('fs');
  // var dir = '../';
  const testFolder = '../'+id;
  const fs = require('fs');
  fs.readdir(testFolder, (err, files) => {
    res.redirect('/file/'+files);
  })
});
// download a file
router.get('/download/:id', function(req, res, next) {
  var s=req.params.id;

  //res.redirect('/');
  var filePath = "../test/"+s; // Or format the path using the `id` rest param
  var fileName = s; // The default name the browser will us

  res.download(filePath, fileName);
  //res.render('index', { title: 'Express' });

});


module.exports = router;
