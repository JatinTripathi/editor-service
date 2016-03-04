var winston=require('winston');
winston.emitErrs=true;

var logger=new (winston.Logger)({
    level:'debug',
    transport:[
        new (winston.transports.Console)({
            timestamp:true,
            handleException:true,
            colorize:true
        }),
        new (winston.transports.File)({
            timestamp:true,
            handleExceptions:true,
            colorize:true,
            filename:'./log/logfile.log'
        })],
    exitOnError:false
});

module.exports=logger;
module.export.stream={
    write:function(message,encoding){
        logger.info(message);
    }
};