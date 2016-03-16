var http=require('http');
var querystring=require('querystring');
var data,response;

module.exports=function(matter){
    var paper=querystring.stringify(matter);
    var option={
        hostname:'elasticSearch',
        method:'POST',
        port:9200,
        path:'/map',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':'doc.length'
        }
    };
    http.request(option,function(req,res){
        req.write(paper);
        req.end();
        res.on('data',function(chunk){
            data=+chunk;
        });
        res.on('end',function(){
            return response=data;
        });
    });
};