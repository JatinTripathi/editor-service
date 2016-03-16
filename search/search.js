var http=require('http');
var querystring=require('querystring');
var chunk;

module.exports=function(matter,callback){
    var paper=querystring.stringify(matter);
    var options={
        hostname:'elasticSearch',
        method:'POST',
        port:9200,
        path:'/index',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':'doc.length'
        }
    };
    http.request(options,function(req,res){
        req.write(paper);
        req.end();
        res.on('data',function(data){
            chunk+=data;
        });
        res.on('end',function(){
            callback(chunk);
        });
    });
};