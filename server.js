var express=require('express');
var morgan=require('morgan');
var logger=require('./log/logger.js');
var path=require('path');
var mongo=require('mongoose');
var bodyParser=require('body-parser');
var search=require('./search/search.js');
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
var save=mongo.createConnection('mongodb://mongo/Docs');
var publish=mongo.createConnection('mongodb://mongo/Docs');



//===============Database(mongodb) Init================//
//====Schema
var doc=new mongo.Schema({
     userId:String,
     title:{type:String},
     shortScript:{type:String},
     content:{type:String}
});

var savedDoc=save.model('savedDoc',doc);
var publishedDoc=publish.model('publishedDoc',doc);
logger.info('Schema Modeling Done');



//==================Index Routing===================//
app.get('/editor',function(req,res){
    res.render('neditor');
});

app.get('/editor/saved/:id',function(req,res){
    savedDoc.findById(req.params.id,function(err,doc){
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
            res.redirect('/editor/published/'+doc._id);
            search(doc,function(data){
                logger.info('Elasticsearch returned'+data);
            });
        });
    }
    else if(req.body.save){
        savedDoc.findById(req.params.id,function(err,doc){
            if(err) throw err;
            doc.title=req.body.title;
            doc.shortScript=req.body.shortScript;
            doc.body=req.body.content;
            
            doc.save(function(err,doc){
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
            res.redirect('/editor/published/'+doc._id);
            search(doc,function(data){
                logger.info('Elasticsearch returned'+data);
            });
        });
    }
    else if(req.body.save){
        var newDoc=new savedDoc;
        //newDoc.userId=req.user.email;
        newDoc.title=req.body.title;
        newDoc.shortScript=req.body.shortScript;
        newDoc.content=req.body.content;
        
        newDoc.save(function(err,doc){
            if(err) logger.error('Something went wrong while saving the the document');
            logger.info('Document "'+doc+'" is Saved');
            res.redirect('/editor/saved/'+doc._id);
        });
    }
});



//======================Port Config====================//
var port=process.env.port||8080;
app.listen(port,function(){
    logger.info('Listening at Port No.'+port);
});
