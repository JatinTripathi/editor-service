var doc={};
doc.title=$("#title").html();
doc.shortScript=$("#shortScript").html();
doc.body=$("#body").html();

var paper=JSON.stringify(doc);

var surl="http://localhost:8080/editor/save";
var purl="http://localhost:8080/editor/publish";

$(document).ready(function(){
    $('#save').click(function(){
        $.post(surl,paper,function(data,textStatus){alert('');});
    });
    $('#publish').click(function(){
        $.post(purl,paper,function(data,textStatus){alert('');});
    });
});
