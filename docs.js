const {remote, ipcRenderer, currentWindow} = require('electron');
const {handleChangeMode, mode} = remote.require('./main');

$(document).ready(async function(){
    if(mode=='light') {
        $('#mode').attr('value','Switch To Night Mode');
        $('link#plugins').attr('href','assets/css/plugins-light.css');
        $('link#scroll').attr('href','assets/css/scrollspyNav-light.css');
    }
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(500);
    
    var load_screen = document.getElementById("load_screen");
    document.body.removeChild(load_screen);
    
    $('#mode').click(async function(){
        await delay(300);
        if($('link#plugins').attr('href')=="assets/css/plugins-light.css"){
            $('#mode').attr('value','Switch To Day Mode')
            $('link#plugins').attr('href','assets/css/plugins-dark.css');
            $('link#scroll').attr('href','assets/css/scrollspyNav-dark.css');
            handleChangeMode(currentWindow, 'dark');
        }else {
            $('#mode').attr('value','Switch To Night Mode');
            $('link#plugins').attr('href','assets/css/plugins-light.css');
            $('link#scroll').attr('href','assets/css/scrollspyNav-light.css');
            handleChangeMode(currentWindow, 'light');
        }
    });
});