var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var request = require('request');
var qs = require('querystring');


/* GET home_page. */
router.get('/', function(req, res, next) {
    res.render('index.html');
});
router.post('/api/update/light', function(req, res, next) {
    console.log(req.body);
    console.log(JSON.stringify(req.body));
    request
        .post({url: req.gw_ip + 'updateLight', form: JSON.stringify(req.body), json: true},function(err, response, body) {
            if(response.statusCode == 200){
                res.json(response.body)
            }// 200
            else{
                res.json({msg:'me conecto pero sin fallo'});
            }
            console.log(response.headers['content-type']); // 'image/png'
        });
});

router.get('/api/lights', function (req, res, next) {
    console.log(req.gw_ip + 'lights');
    request
        .get({url: req.gw_ip + 'lights', qs: '', json: true},function(err, response, body) {
            if(response.statusCode == 200){
                console.log(response.body);
                res.json(response.body);
            }// 200
            else{
                res.json({msg:'me conecto pero sin fallo'});
            }
            console.log(response.headers['content-type']); // 'image/png'
        });
});

router.get('/api/test', function(req, res, next) {
  console.log('estoy por aqui');
  request
      .post({url: req.gw_ip + 'post', form: {key:'value'}, json: true},function(err, response, body) {
        if(response.statusCode == 200){
          res.json(response.body)
        }// 200
        else{
          res.json({msg:'me conecto pero sin fallo'});
        }
        console.log(response.headers['content-type']); // 'image/png'
      });
});

module.exports = router;