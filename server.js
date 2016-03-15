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
     content:{type:String, es_indexed:true}
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
    res.render('neditor');
});

app.get('/editor/saved/:id',function(req,res){
    savedDoc.finById(req.params.id,function(err,doc){
        if(err) throw err;
        res.render('seditor',{doc:doc});
    });
});

app.get('/editor/published/:id',function(req,res){
    publishedDoc.findById(req.params.id,function(err,doc){
        if(err) throw err;
        res.render('paper',{doc:doc});
    });
});

app.post('/editor/saved/:id',function(req,res){
    if(req.body.publish){
        var newDoc=new publishedDoc;
        //newDoc.userId=req.user._id;
        newDoc.title=req.body.title;
        newDoc.shortScript=req.body.shortScript;
        newDoc.content=req.body.content;
        
        newDoc.save(function(err,doc){
            if(err) logger.error('Something went wrong while saving the the document');
            logger.info('New Document Published');
            res.redirect('/editor/publised/'+doc._id);
        });
    }
    else if(req.body.save){
        savedDoc.findById(req.params.id,function(err,doc){
            if(err) throw err;
            doc.title=req.body.title;
            doc.shortScript=req.body.shortScript;
            doc.body=req.body.content;
            
            newDoc.save(function(err,doc){
                if(err) logger.error('Something went wrong while saving the the document');
                logger.info('Document "'+doc+'" is Saved');
                res.redirect('/editor/saved/'+doc._id);
            });
        });
        //newDoc.userId=req.user.email;
        
    }
});

app.post('/editor',function(req,res){
    if(req.body.publish){
        var newDoc=new publishedDoc;
        //newDoc.userId=req.user._id;
        newDoc.title=req.body.title;
        newDoc.shortScript=req.body.shortScript;
        newDoc.content=req.body.content;
        
        newDoc.save(function(err,doc){
            if(err) logger.error('Something went wrong while saving the the document');
            logger.info('New Document Published');
            res.redirect('/editor/publised/'+doc._id);
        });
    }
    else if(req.body.save){
        var newDoc=new savedDoc;
        //newDoc.userId=req.user.email;
        newDoc.title=req.body.title;
        newDoc.shortScript=req.body.shortScript;
        newDoc.content=req.body.content;
        
        doc.save(function(err,doc){
            if(err) logger.error('Something went wrong while saving the the document');
            logger.info('Document "'+doc+'" is Saved');
            res.redirect('/editor/saved/'+doc._id);
        });
    }
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
