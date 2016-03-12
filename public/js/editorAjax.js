var paperContent=$("#editorContent").serializeArray();

$(document).ready(function(){
    $('#save').click(function(){
        $.post('/editor/save',paperContent,function(data,textStatus){alert('');});
    });
    $('#publish').click(function(){
        $.post('/editor/publish',paperContent,function(data,textStatus){alert('');});
    });
});
