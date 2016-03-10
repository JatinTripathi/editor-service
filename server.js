var express=require('express');
var morgan=require('morgan');
var logger=require('./log/logger.js');
var path=require('path');
var mongo=require('mongoose');
var bodyParser=require('body-parser');

var app=express();

//==============Express Config=============//
app.use(bodyParser.urlencoded({extended:false}));


//============Mongodb Config================//
var save=mongo.createConnection('mongodb://mongo:27018/savedDocs');
var publish=mongo.createConnection('mongodb://mongo:27018/publishedDocs');

//===============Schema Init================//
var schema=new mongo.Schema({
    userId:'string',
    title:'string',
    shortScript:'string',
    body:'string'});
    
    
//================Mongo Models==============//
var savedDoc=save.model('savedDoc',schema);
var publishedDoc=publish.model('publishedDoc',schema);


//============Express Config================//
app.use(morgan('combine',{'stream':logger.stream}));
logger.info('Overriding Express Logger');


//=======================View Config=======================//
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');


//======================Index Routing===================//
app.get('/editor',function(req,res){
    res.render('editor');
});

app.post('/publish',function(req,res){
    var newDoc=new publishedDoc;
    newDoc.userId=
    newDoc.title=req.body.title;
    newDoc.shortScript=req.body.shortScript;
    newDoc.body=req.body.body;
    
    newDoc.save(function(err){
        if(err) logger.error('Something went wrong while saving the the document');
        logger.info('New Document Published');
    });
    res.send('Published');
});

//Saved Using Ajax
//===========TODO Persisting single record only
app.post('/editor/save',function(req,res){
    var newDoc=new savedDoc;
    newDoc.userId=
    newDoc.title=req.body.title;
    newDoc.shortScript=req.body.shortScript;
    newDoc.body=req.body.body;
    
    newDoc.save(function(err){
        if(err) logger.error('Something went wrong while saving the the document');
        logger.info('Document "'+req.body.title+'" is Saved');
    });
    res.send('Saved');
});


//======================Port Config====================//
var port=process.env.port||8081;
app.listen(port);
logger.info('Listening at Port No.'+port);
