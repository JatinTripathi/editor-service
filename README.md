# Editor Microservice
This is an end microservice application giving the functionality of online text editor with four basic functions,
* Saving the written part
* Persisting the saved part after consecutive saves
* Publishing the articles for feeds
* Sending the published article to search microservice

There will be two collection "SavedDoc" and "PublishedDoc" in our "Docs" Mongodb Database.

##Prerequisites:
* Docker-engine
* Mongodb Docker Container
* Elasticsearch/Solr Node.js Application (Optional)

##Build-up
Start Docker Engine and Mongo Container,
Run
`docker build --name <username>/editor-service /path/to/editor-service's/Dokerfile`
in your terminal and then,
`docker run -it --link mongo:db <username>/editor-services bash`
This service will work on port 8080.

##API
This microservice can be deployed for adding an editor to any application by using simple HTTP RESTful API calls, by using `GET localhost:8080/editor` we can get an editor.
By `POST localhost:8080/editor` we initiate a process of saving or publishing an article, if we have populated our form response body with saved, means `req.body.save` it will save the article or `req.body.publish` then it will publish it. The JSON format for the documents will be,
```javascript
mongoose.model({
  _id:String,
  title:String,
  shortScript:Script,
  content:String});
```
Then for calling any saved or published article, we just need to call `GET localhost:8080/saved/:<article ID>` or `GET localhost:8080/published/:<article ID>` respectively.

After publishing the article this service also makes published article data available to any [search microservice](https://github.com/JatinTripathi/search-service) for indexing.
This snippet should be added to published document callback
```javascript
search(doc,function(data){
  logger.info('Elasticsearch returned'+data);
});
```
It will call the code below to send whole article to search microservice in JSON format,
```javascript
//========./search/search.js
var http=require('http');
var querystring=require('querystring');
var chunk;

module.exports=function(matter,callback){
    var paper=querystring.stringify(matter);
    var options={
        hostname:'search',
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
```
