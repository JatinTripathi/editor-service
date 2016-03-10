var editor=new MediumEditor('.editor');
var paperContent=$("#editorContent").serializeArray();

$(document).ready(function(){
    $('#save').click(function(){
        $.post('http://192.168.99.100:8080/editor/save',paperContent,function(data,textStatus,jqXHR){
          
        });
    });
    $('#publish').click(function(){
        $.post('http://192.168.99.100:8080/editor/publish',paperContent,function(data,textStatus,jqXHR){})
    });
});
