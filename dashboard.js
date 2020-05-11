const {remote, ipcRenderer} = require('electron');
const {handleForm, mode, handleChangeMode} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
var {config} = remote.getGlobal('sharedObj');

const submitFormButton = document.querySelector("#portForm");
const responseParagraph = document.getElementById('response');
// const renderGraphsButton = document.querySelector('#renderGraphsBtn');
const submitMapButton = document.querySelector("#submit_map");
const slideButton = document.querySelector("#slideBtn");

$(document).ready(async function(){
    // var {mode} = remote.require('./main');
    // App.init();
    if(mode=='light') {
        $('#mode').attr('value','Switch To Night Mode');
        $('link#plugins').attr('href','assets/css/plugins-light.css');
        $('link#modules').attr('href','assets/css/widgets/modules-widgets-light.css');
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
            $('link#modules').attr('href','assets/css/widgets/modules-widgets-dark.css');
            handleChangeMode(currentWindow, 'dark');
        }else {
            $('#mode').attr('value','Switch To Night Mode');
            $('link#plugins').attr('href','assets/css/plugins-light.css');
            $('link#modules').attr('href','assets/css/widgets/modules-widgets-light.css');
            handleChangeMode(currentWindow, 'light');
        }
    });
});

// Set mapping mode
var map_mode = '1';

// Initialize sensors view
function initPage() {
    for (var i = 1; i <= 35; i++) {
        const sensorField = document.querySelector('#sensor_' + i);
        sensorField.innerHTML = config['Sensor #' + i];
    }
}

initPage();

// Since the buttons are active
// renderGraphsButton.checked = true;
slideButton.checked = true;

// Stores the current state of COM Port toggle
var portToggle = false;

// Decide whether to render track
var renderGraphs = true;
var locked = false;

submitFormButton.addEventListener("submit", function(event) {
    event.preventDefault(); // stop the form from submitting
    let port_name = document.getElementById("port_input").value;
    handleForm(currentWindow, port_name)
});

// renderGraphsButton.addEventListener('change', function(event) {
//     event.preventDefault(); // stop the form from submitting
//     if (!this.checked) {
//         renderGraphs = false;
//     } else {
//         renderGraphs = true;
//     }
// });

slideButton.addEventListener('change', function(event) {
    event.preventDefault();
    if (!this.checked) {
        map_mode = '2';
    } else {
        map_mode = '1';
    }
});

ipcRenderer.on('form-received', function(event, args) {
    responseParagraph.innerHTML = "Connected to " + args;
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

ipcRenderer.on('ser-data', function(event, data) {
    // console.log(data)
    for (var i = 0; i < 35; i++) {
        // console.log('#sensor_'+eval(i+1)+'_data');
        const sensorDataField = document.querySelector('#sensor_' + eval(i + 1) + '_data');
        console.log(map_mode);
        sensorDataField.innerHTML = data[i] * 1.03 + ' ' + config['Sensor #' + eval(i + 1) + '_unit' + map_mode];
    }
});