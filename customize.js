const {remote, ipcRenderer} = require('electron');
const {handleForm, handleNameChange, handleMapChange, savePath, handleLoadConfig, mode, handleChangeMode} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
const Swal = require('sweetalert2');

const submitFormButton = document.querySelector("#portForm");
const responseParagraph = document.getElementById('response');
const submitMapButton = document.querySelector("#submitMap");
const submitNameButton = document.querySelector("#submitName");
const saveConfigButton = document.querySelector("#saveConfig");
const loadConfigButton = document.querySelector("#loadConfigForm");

$(document).ready(async function(){
    // var {mode} = remote.require('./main');
    if(mode=='light') {
        $('#mode').attr('value','Switch To Night Mode');
        $('link#plugins').attr('href','assets/css/plugins-light.css');
        $('link#swal').attr('href','plugins/sweetalerts/sweetalert2-light.min.css');
        $('link#fileUpload').attr('href','plugins/file-upload/file-upload-with-preview-light.min.css');
        $('link#select2').attr('href','plugins/select2/select2.min-light.css');
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
            $('link#swal').attr('href','plugins/sweetalerts/sweetalert2-dark.min.css');
            $('link#fileUpload').attr('href','plugins/file-upload/file-upload-with-preview-dark.min.css');
            $('link#select2').attr('href','plugins/select2/select2.min-dark.css');
            $('link#scroll').attr('href','assets/css/scrollspyNav-dark.css');
            handleChangeMode(currentWindow, 'dark');
        }else {
            $('#mode').attr('value','Switch To Night Mode');
            $('link#plugins').attr('href','assets/css/plugins-light.css');
            $('link#swal').attr('href','plugins/sweetalerts/sweetalert2-light.min.css');
            $('link#fileUpload').attr('href','plugins/file-upload/file-upload-with-preview-light.min.css');
            $('link#select2').attr('href','plugins/select2/select2.min-light.css');
            $('link#scroll').attr('href','assets/css/scrollspyNav-light.css');
            handleChangeMode(currentWindow, 'light');
        }
    });
});

function initPage() {
    var {config} = remote.getGlobal('sharedObj');
    for (var i = 1; i <= 35; i++) {
        const sensorNameField = document.querySelector('#sensor_' + i + '_name');
        sensorNameField.innerHTML = config['Sensor #' + i];

        const sensorMappingField1 = document.querySelector('#sensor_' + i + '_mapping1');
        sensorMappingField1.innerHTML = config['Sensor #' + i + '_mapping1'];

        const sensorUnitField1 = document.querySelector('#sensor_' + i + '_unit1');
        sensorUnitField1.innerHTML = config['Sensor #' + i + '_unit1'];

        const sensorMappingField2 = document.querySelector('#sensor_' + i + '_mapping2');
        sensorMappingField2.innerHTML = config['Sensor #' + i + '_mapping2'];

        const sensorUnitField2 = document.querySelector('#sensor_' + i + '_unit2');
        sensorUnitField2.innerHTML = config['Sensor #' + i + '_unit2'];
    }
}

initPage();

// Stores the current state of COM Port toggle
var portToggle = false;

submitFormButton.addEventListener("submit", function(event) {
    event.preventDefault(); // stop the form from submitting
    let port_name = document.getElementById("port_input").value;
    handleForm(currentWindow, port_name)
});

ipcRenderer.on('form-received', function(event, args) {
    responseParagraph.innerHTML = "Connected to " + args;
});

submitMapButton.addEventListener("submit", function(event) {
    event.preventDefault(); // stop the form from submitting
    let sensorID = document.getElementById("sensorMapID").value;
    let map1 = document.getElementById("map1").value;
    let unit1 = document.getElementById("unit1").value;
    let map2 = document.getElementById("map2").value;
    let unit2 = document.getElementById("unit2").value;

    // console.log(sensorID);
    // console.log(map1);
    // console.log(unit1);
    // console.log(map2);
    // console.log(unit2);

    handleMapChange(currentWindow, sensorID, map1, unit1, map2, unit2);
});

ipcRenderer.on('map-changed', function(event, args) {
    Swal.fire("Successful");
    initPage();
});

submitNameButton.addEventListener("submit", function(event) {
    event.preventDefault();
    let sensorID = document.getElementById("sensorNameID").value; 
    let sensorName = document.getElementById("sensorName").value;
    handleNameChange(currentWindow, sensorID, sensorName);
});

ipcRenderer.on('name-changed', function(event, args) {
    Swal.fire("Successful");
    initPage();
});

saveConfigButton.addEventListener('click', function(event) {
    event.preventDefault();
    var {config} = remote.getGlobal('sharedObj');
    const path = require('path');
    const fs = require('fs');
    fs.writeFileSync(path.join(savePath, './config.json'), JSON.stringify(config));
    Swal.fire("Successful", "Saved to Documents as 'config.json'");
});

loadConfigButton.addEventListener('submit', function(event) {
    event.preventDefault();
    let fileName = document.getElementById('fileNameField').files[0].path;
    // console.log(fileName);
    handleLoadConfig(currentWindow, fileName);
});

ipcRenderer.on('config-success', function(event, args) {
    Swal.fire('Successful');
    initPage();
});

ipcRenderer.on('config-failure', function(event, args) {
    Swal.fire('Error', 'Bad file format.');
});

ipcRenderer.on('action-port', function(event, args) {
    if (!portToggle) {
        document.getElementById("portContainer").setAttribute("class", "nav-item dropdown user-profile-dropdown order-lg-0 order-1 show")
        document.getElementById("userProfileDropdown").setAttribute("aria-expanded", "true");
        document.getElementById("containerFadeIn").setAttribute("class", "dropdown-menu position-absolute e-animated e-fadeInUp show")
        portToggle = true;
    } else {
        document.getElementById("portContainer").setAttribute("class", "nav-item dropdown user-profile-dropdown order-lg-0 order-1")
        document.getElementById("userProfileDropdown").setAttribute("aria-expanded", "false");
        document.getElementById("containerFadeIn").setAttribute("class", "dropdown-menu position-absolute e-animated e-fadeInUp")
        portToggle = false;
    }
})

submitNameButton.addEventListener("submit", function(event) {
    event.preventDefault(); // stop the form from submitting
});