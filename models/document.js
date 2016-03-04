var mongo=require('mongoose');

module.exports=mongo.model('documents',{
    userId:'string',
    title:'string',
    shortScript:'string',
    body:'string'
});