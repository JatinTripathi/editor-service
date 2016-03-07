var paperContent=$("#editorContent").serializeArray();

$.("button").click(function(){
    $.post('/save',paperContent,function(data,textStatus,jqXHR){
        
    });
    
    $.post('/publish',paperContent,function(data,textStatus,jqXHR){
        
    });
});