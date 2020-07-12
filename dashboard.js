const {remote, ipcRenderer, ipcMain} = require('electron');
const {handleForm, mode, handleChangeMode, handleChangeTrackMap, handleSaveSession, handleNewSession, handleConnectToCloud, handleDisconnectToCloud} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
var {config, trackMap, connectedToCloud, connectedToSer, cloudURL, serPortName} = remote.getGlobal('sharedObj');

const submitFormButton = document.querySelector("#portForm");
const responseParagraph = document.getElementById('response');
const slideButton = document.querySelector("#slideBtn");
const connectToCloudForm = document.querySelector("#cloudForm")

var time_step = 1;

// Temporary variables used in mapping
var trackMapInitialized = false;
var switchToTrackMapping = false;

var map = [];

$(document).ready(async function(){
    if(mode=='light') {
        $('#mode').attr('value','Switch To Night Mode');
        $('link#plugins').attr('href','assets/css/plugins-light.css');
        $('link#modules').attr('href','assets/css/widgets/modules-widgets-light.css');
        $('link#dash').attr('href','assets/css/dashboard/dash_2-light.css');
        $('link#modals').attr('href','assets/css/components/custom-modal-light.css');
    }
    
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(500);
    
    var load_screen = document.getElementById("load_screen");
    load_screen.parentNode.removeChild(load_screen);

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
            $('link#plugins').attr('href','assets/css/plugins-dark.css');
            $('link#modules').attr('href','assets/css/widgets/modules-widgets-dark.css');
            $('link#dash').attr('href','assets/css/dashboard/dash_2-dark.css');
            $('link#modals').attr('href','assets/css/components/custom-modal-dark.css');
            $('#mode').attr('value','Switch To Day Mode')
            handleChangeMode(currentWindow, 'dark');
        }else {
            $('link#plugins').attr('href','assets/css/plugins-light.css');
            $('link#modules').attr('href','assets/css/widgets/modules-widgets-light.css');
            $('link#dash').attr('href','assets/css/dashboard/dash_2-light.css');
            $('link#modals').attr('href','assets/css/components/custom-modal-light.css');
            $('#mode').attr('value','Switch To Night Mode');
            handleChangeMode(currentWindow, 'light');
        }
        await delay(800);
        var load_screen = document.getElementById("load_screen");
        load_screen.parentNode.removeChild(load_screen);
    });

    chart.addPointAnnotation({
        id: 'car-point',
        x: time_step,
        y: 0,
        label: {
          style: {
            cssClass: 'd-none'
          }
        },
        customSVG: {
            SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#1b55e2" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
            cssClass: undefined,
            offsetX: -8,
            offsetY: 5
        }
      });
    time_step++;
});

// Set mapping mode
var map_mode = '1';

// Initialize sensors view
function initPage() {
    var {connectedToCloud, connectedToSer, cloudURL, serPortName} = remote.getGlobal('sharedObj');
    var btn = document.getElementById("cloudConnectBtn");
    if(connectedToCloud) {
        console.log(cloudURL);
        $("#basic-url").attr('value', cloudURL);
        responseParagraph.innerHTML = "Connected to AWS.";
        $("#cloudConnectBtn").attr('class', 'btn btn-danger mt-2 mb-2 btn-block')
        btn.innerHTML = "Disconnect";
        btn.value = "connected";
    }else if(connectedToSer) {
        responseParagraph.innerHTML = "Connected to " + serPortName;
    }

    chart.updateSeries([{
        data:trackMap
    }]);
    for (var i = 1; i <= 35; i++) {
        const sensorField = document.querySelector('#sensor_' + i);
        const sensorDataField = document.querySelector('#sensor_' + i + '_data');
        sensorField.innerHTML = config['Sensor #' + i];
        sensorDataField.innerHTML = '0 ' + config['Sensor #' + i + '_unit' + map_mode];
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

    // Disconnect from cloud
    var btn = document.getElementById("cloudConnectBtn");
    $("#cloudConnectBtn").attr('class', 'btn btn-primary mt-2 mb-2 btn-block')
    handleDisconnectToCloud(currentWindow);
    btn.innerHTML = "Connect";
    responseParagraph.innerHTML = "";
    btn.value = "disconnected";
    connectToCloudForm.cloudFormSubmitBtn.disabled = false;

    let port_name = document.getElementById("port_input").value;
    handleForm(currentWindow, port_name)
});

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

ipcRenderer.on('form-not-received', function(event, args) {
    responseParagraph.innerHTML = "Couldn't connect to " + args;
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
    if(switchToTrackMapping) {
        map.push({
            x:data[0],
            y:data[1]
        });
        mapChart.updateSeries([{
            data: map
        }]);
    }else {
        for (var i = 0; i < 35; i++) {
            const sensorDataField = document.querySelector('#sensor_' + eval(i + 1) + '_data');
            var exp = config['Sensor #'+eval(i + 1)+'_mapping'+map_mode];
            var x = data[i] * 1.03;
            var value = eval(exp).toFixed(2);
            sensorDataField.innerHTML = value + ' ' + config['Sensor #' + eval(i + 1) + '_unit' + map_mode];
        }
        document.getElementById("brakePressureStat").innerHTML = data[10];
        document.getElementById("steeringAngleStat").innerHTML = data[11] * 10 + ' °';
        document.getElementById("cellTempStat").innerHTML = data[12] * 10 + ' °C';
        document.getElementById("throttleStat").innerHTML = data[13] * 10;

        document.getElementById("lapCount").innerHTML = data[2];
        document.getElementById("lapTiming").innerHTML = 'Lap timing : '+data[11]*1.03+'s';

        $("#brakePressure").attr('aria-valuenow', data[10]);
        $("#brakePressure").attr('style', 'width:'+eval(data[10]*10)+'%');

        $("#steeringAngle").attr('aria-valuenow', data[11]);
        $("#steeringAngle").attr('style', 'width:'+eval(data[11]*10)+'%');

        $("#cellTemp").attr('aria-valuenow', data[12]);
        $("#cellTemp").attr('style', 'width:'+eval(data[12]*10)+'%');

        $("#throttle").attr('aria-valuenow', data[13]);
        $("#throttle").attr('style', 'width:'+eval(data[13]*10)+'%');

        chart.clearAnnotations();

        chart.addPointAnnotation({
            id: 'car-point',
            x: data[0],
            y: data[1],
        customSVG: {
            SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#1b55e2" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
            cssClass: undefined,
            offsetX: -8,
            offsetY: 5
        }
        });
        time_step++;
    }
});

$('#loadTrackMapBtn').click(async function() {
    map = []
    switchToTrackMapping = true;
});

$("#newSessionBtn").click(async function (event, args) {
    event.preventDefault();
    handleNewSession(currentWindow);
});

ipcRenderer.on('new-session-success', async function() {
    Snackbar.show({text: 'Session Initialized.', duration: 5000});
});

$("#saveSessionBtn").click(async function(event, args) {
    event.preventDefault();
    handleSaveSession(currentWindow);
});

ipcRenderer.on('session-save-success', function() {
    Snackbar.show({text: 'Session saved.', duration: 5000});
});

ipcRenderer.on('session-save-failure', function() {
    Snackbar.show({
        text: "Couldn't save current session.",
        actionTextColor: '#fff',
        backgroundColor: '#e2a03f'
    });
});

$("#exampleModal").on("hidden.bs.modal", async function () {
    map = [];
    switchToTrackMapping = false;
});

$('#resetTrackMap').click(function() {
    map = [];
    mapChart.updateSeries([{
        data: map
    }]);
});

$("#saveTrackMap").click(function() {
    switchToTrackMapping = false;
    trackMap = map;
    trackMapInitialized = true;
    handleChangeTrackMap(currentWindow, map);
});

ipcRenderer.on('track-map-change-success', function(event, args) {
    Snackbar.show({text: 'Track saved.', duration: 5000});
    initPage();
});

ipcRenderer.on('cloud-connection-success', function(event, args) {
    Snackbar.show({
        text: 'Connected',
        actionTextColor: '#fff',
        backgroundColor: '#8dbf42',
        duration: 5000
    });
});

ipcRenderer.on('cloud-connection-failed', function(event, args) {
    Snackbar.show({
        text: "Disconnected from the server.",
        actionTextColor: '#fff',
        backgroundColor: '#e2a03f',
        duration: 5000
    });
});

connectToCloudForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const delay = ms => new Promise(res => setTimeout(res, ms));
    var btn = document.getElementById("cloudConnectBtn");
    connectToCloudForm.cloudFormSubmitBtn.disabled = true;
    var cloud_url = document.getElementById("basic-url").value;

    if(btn.value === "disconnected") {
        $.get('http://' + cloud_url).done(function () {
            handleConnectToCloud(currentWindow, cloud_url);
            responseParagraph.innerHTML = "Connected to AWS.";
            $("#cloudConnectBtn").attr('class', 'btn btn-danger mt-2 mb-2 btn-block')
            btn.innerHTML = "Disconnect";
            btn.value = "connected";
            connectToCloudForm.cloudFormSubmitBtn.disabled = false;
          }).fail(async function () {
                $("#response").attr("style", "color:#e7515a");
                responseParagraph.innerHTML = "Please provide a valid URL.";
                await delay(1000);
                responseParagraph.innerHTML = "";
                $("#response").attr("style", "color:white");
                connectToCloudForm.cloudFormSubmitBtn.disabled = false;
          });
    }else {
        $("#cloudConnectBtn").attr('class', 'btn btn-primary mt-2 mb-2 btn-block')
        handleDisconnectToCloud(currentWindow);
        btn.innerHTML = "Connect";
        responseParagraph.innerHTML = "";
        btn.value = "disconnected";
        connectToCloudForm.cloudFormSubmitBtn.disabled = false;
    }
});
