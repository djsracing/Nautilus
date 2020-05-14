const {remote, ipcRenderer} = require('electron');
const {handleForm, mode, handleChangeMode} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
var {config} = remote.getGlobal('sharedObj');

const submitFormButton = document.querySelector("#portForm");
const responseParagraph = document.getElementById('response');
const submitMapButton = document.querySelector("#submit_map");
const slideButton = document.querySelector("#slideBtn");

$(document).ready(async function(){
    if(mode=='light') {
        $('#mode').attr('value','Switch To Night Mode');
        $('link#plugins').attr('href','assets/css/plugins-light.css');
        $('link#modules').attr('href','assets/css/widgets/modules-widgets-light.css');
        $('link#dash').attr('href','assets/css/dashboard/dash_2-light.css');
    }
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(500);
    
    var load_screen = document.getElementById("load_screen");
    load_screen.parentNode.removeChild(load_screen);

    $('#mode').click(async function(){
        await delay(300);
        if($('link#plugins').attr('href')=="assets/css/plugins-light.css"){
            $('#mode').attr('value','Switch To Day Mode')
            $('link#plugins').attr('href','assets/css/plugins-dark.css');
            $('link#modules').attr('href','assets/css/widgets/modules-widgets-dark.css');
            $('link#dash').attr('href','assets/css/dashboard/dash_2-dark.css');
            handleChangeMode(currentWindow, 'dark');
            // titlebar.updateBackground(customTitlebar.Color.fromHex('#191E3A'));
        }else {
            $('#mode').attr('value','Switch To Night Mode');
            $('link#plugins').attr('href','assets/css/plugins-light.css');
            $('link#modules').attr('href','assets/css/widgets/modules-widgets-light.css');
            $('link#dash').attr('href','assets/css/dashboard/dash_2-light.css');
            handleChangeMode(currentWindow, 'light');
            // titlebar.updateBackground(customTitlebar.Color.fromHex('#FFFFFF'));
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
        // console.log(map_mode);
        var exp = config['Sensor #'+eval(i + 1)+'_mapping'+map_mode];
        var x = data[i] * 1.03;
        var value = eval(exp);
        sensorDataField.innerHTML = value + ' ' + config['Sensor #' + eval(i + 1) + '_unit' + map_mode];
    }
    $("#brakePressure").attr('aria-valuenow', data[10]);
    $("#brakePressure").attr('style', 'width:'+eval(data[10]*10)+'%');
    // $( "#brakePressure" ).load(window.location.href + " #brakePressure" );

    $("#steeringAngle").attr('aria-valuenow', data[11]);
    $("#steeringAngle").attr('style', 'width:'+eval(data[11]*10)+'%');
    // $("#steeringAngle").load(window.location.href + " #steeringAngle" );

    $("#cellTemp").attr('aria-valuenow', data[12]);
    $("#cellTemp").attr('style', 'width:'+eval(data[12]*10)+'%');
    // $( "#cellTemp" ).load(window.location.href + " #cellTemp" );

    $("#throttle").attr('aria-valuenow', data[13]);
    $("#throttle").attr('style', 'width:'+eval(data[13]*10)+'%');
    // $( "#throttle" ).load(window.location.href + " #throttle" );

    chart.appendData([{
        data: [data.slice(0,1)],
      }]);
});