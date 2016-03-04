var express=require('express');
var morgan=require('morgan');
var logger=require('./log/logger.js');
var path=require('path');
var mongo=require('mongoose');
var doc=require('./models/document.js')

var app=express();


//============Mongodb Config================//
var save=mongo.createConnection('http://localhost:27017/savedDocs');
var publish=mongo.createConnection('http://localhost:27017/publishedDocs');


//============Express Config================//
app.use(morgan('combine',{'stream':logger.stream}));
logger.info('Overriding Express Logger');


//============View Config===============//
app.set('views',path.join(__dirname(),'views'));
app.set('view engine','jade');


//==========Index Routing==========//
app.get('/editor',function(req,res){
    res.render('editor');
});

app.post('/editor/publish',function(req,res){
    var newDoc=new doc;
    newDoc.title=req.body.title;
    newDoc.shortScript=req.body.shortScript;
    newDoc.body=req.body.body;
    
    newDoc.save(function(err,newDoc){
        if(err) logger.error('Something went wrong while saving the the document');
        logger.info('New Document Saved');
    });
    res.redirect('/home');
});


//===========Port Config==========//
var port=process.env.port||8081;
app.listen(port);
logger.info('Listening at Port No.'+port);