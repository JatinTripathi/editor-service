var express=require('express');
var morgan=require('morgan');
var logger=require('./log/logger.js');
var path=require('path');
var mongo=require('mongoose');
var bodyParser=require('body-parser');

var app=express();
logger.info('Done Initiation');


//==============Express Config=============//
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

//============Mongodb Config================//
var save=mongo.createConnection('mongodb://db/savedDocs');
var publish=mongo.createConnection('mongodb://db/publishedDocs');


//===============Schema Init================//
var schema=new mongo.Schema({
    userId:'string',
    title:{type:string, es_indexed:true},
    shortScript:{type:string, es_indexed:true},
    body:{type:string, es_indexed:true}
    
    
//================Mongo Models==============//
var savedDoc=save.model('savedDoc',schema);
var publishedDoc=publish.model('publishedDoc',schema);


//================Mongoosastic Config=========//
schema.plugin(mongoosastic,{
	host:'search',
	port:9200,
	protocol:'https',
	culrDebug:true}
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


//============Express Config================//
app.use(morgan('combine',{'stream':logger.stream}));
logger.info('Overriding Express Logger');


//======================Index Routing===================//
app.get('/editor',function(req,res){
    res.render('editor');
});

app.post('/editor/publish',function(req,res){
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
/*
    else if(req.body.save){
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
    }
});
*/

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
var port=process.env.port||8080;
app.listen(port);
logger.info('Listening at Port No.'+port);
