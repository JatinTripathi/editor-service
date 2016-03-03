var express=require('express');
var morgan=require('morgan');
var logger=require('./log/logger.js');
var path=require('path');

var app=express();

//============Express Config================//
app.use(morgan('combine',{'stream':logger.stream}));

//============View Config===============//
app.set('views',path.join(__dirname(),'views'));
app.set('view engine','jade');

//==========Index Routing==========//
app.get('/editor',function(req,res){
    res.render('editor');
});
app.post('/editor/submit',function(req,res){
    
});

//===========Port Config==========//
var port=process.env.port||8081;
app.listen(port);
logger.info('Listening at Port No.'+port);