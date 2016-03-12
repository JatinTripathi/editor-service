var express=require('express');
var morgan=require('morgan');
var logger=require('./log/logger.js');
var path=require('path');
var mongo=require('mongoose');
var bodyParser=require('body-parser');
var mongoosastic=require('mongoosastic');
//============App Init
var app=express();


//==============Express Config=============//
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');
//=================Logger Config
app.use(morgan(':method :url :status :response-time ms - :res[content-length]',{'stream':logger.stream}));
logger.info('Overriding Express Logger');


//============Mongodb Config================//
var save=mongo.createConnection('mongodb://localhost:27017/Docs');
var publish=mongo.createConnection('mongodb://localhost:27017/Docs');


//===============Database(mongodb) Init================//
//====Schema
var doc=new mongo.Schema({
     userId:String,
     title:{type:String, es_indexed:true},
     shortScript:{type:String, es_indexed:true},
     body:{type:String, es_indexed:true}
});

var savedDoc=save.model('savedDoc',doc);
var publishedDoc=publish.model('publishedDoc',doc);
logger.info('Schema Modeling Done');


//================Mongoosastic Config=========//
/*
doc.plugin(mongoosastic,{
	host:'search',
	port:9200,
	protocol:'https',
	culrDebug:true});
//=================Mapping
savedDoc.createMapping(function(err,mapping){
	if(err){
		logger.error('error creating mapping');
		logger.log(err);
		}
	else{
		logger.info('mapping created!');
		logger.info(mapping);
	}
});
*/

//==================Index Routing===================//
app.get('/editor',function(req,res){
    res.render('editor');
});

app.post('/editor/publish',function(req,res){
        var newDoc=new publishedDoc;
        //newDoc.userId=req.user._id;
        newDoc.title=req.body.title;
        newDoc.shortScript=req.body.shortScript;
        newDoc.body=req.body.body;
        
        newDoc.save(function(err){
            if(err) logger.error('Something went wrong while saving the the document');
            logger.info('New Document Published');
            newDoc.on('es-indexed',function(err,res){
                if(err) throw err;
                res.send('Published and Indexed');
                logger.info('Document Indexed in Elasticsearch');
            });
        });
        
});

app.post('/editor/save',function(req,res){
        var newDoc=new savedDoc;
        //newDoc.userId=req.user.email;
        newDoc.title=req.body.title;
        newDoc.shortScript=req.body.shortScript;
        newDoc.body=req.body.body;
        
        newDoc.save(function(err,docu){
            if(err) logger.error('Something went wrong while saving the the document');
            logger.info('Document "'+docu+'" is Saved');
        });
        res.send('Saved');
});

//Saved Using Ajax
//===========TODO Persisting single record only
/*
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
*/

//======================Port Config====================//
var port=process.env.port||8080;
app.listen(port);
logger.info('Listening at Port No.'+port);
