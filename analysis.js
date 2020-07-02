const {remote, ipcRenderer, currentWindow} = require('electron');
const {handleChangeMode, mode} = remote.require('./main');
var {config} = remote.getGlobal('sharedObj');

function initPage() {
    for (var i = 1; i <= 35; i++) {
        const sensorField = document.querySelector('#sensor_' + i);
        sensorField.innerHTML = config['Sensor #' + i];
    }
}

$(document).ready(async function(){
    initPage();
    if(mode=='light') {
        $('#mode').attr('value','Switch To Night Mode');
        $('link#plugins').attr('href','assets/css/plugins-light.css');
    }
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(500);
    
    var load_screen = document.getElementById("load_screen");
    document.body.removeChild(load_screen);
    
    $('#mode').click(async function(){
        var loadDiv = document.createElement("div");
        var loader = document.createElement("div");
        var loaderContent = document.createElement("div");
        var spinner = document.createElement("div");

        loadDiv.setAttribute("id", "load_screen");
        loader.setAttribute("class", "loader");
        loaderContent.setAttribute("class", "loader-content");
        spinner.setAttribute("class", "spinner-grow align-self-center");
        
        document.getElementById("mainBody").appendChild(loadDiv);
        loadDiv.appendChild(loader);
        loader.appendChild(loaderContent);
        loaderContent.appendChild(spinner);

        if($('link#plugins').attr('href')=="assets/css/plugins-light.css"){
            $('#mode').attr('value','Switch To Day Mode')
            $('link#plugins').attr('href','assets/css/plugins-dark.css');
            handleChangeMode(currentWindow, 'dark');
        }else {
            $('#mode').attr('value','Switch To Night Mode');
            $('link#plugins').attr('href','assets/css/plugins-light.css');
            handleChangeMode(currentWindow, 'light');
        }
        await delay(800);
        var load_screen = document.getElementById("load_screen");
        load_screen.parentNode.removeChild(load_screen);
    });
});
