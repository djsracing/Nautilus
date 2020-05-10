const {remote, ipcRenderer} = require('electron');
const {handleForm} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
var {config} = remote.getGlobal('sharedObj');

const submitFormButton = document.querySelector("#portForm");
const responseParagraph = document.getElementById('response');
const renderGraphsButton = document.querySelector('#renderGraphsBtn');
const submitMapButton = document.querySelector("#submit_map");
const submitNameButton = document.querySelector("#submit_name");

function initPage() {
    for (var i = 1; i <= 35; i++) {
        const sensorNameField = document.querySelector('#sensor_' + i + '_name');
        sensorNameField.innerHTML = config['sensor_' + i];

        const sensorMappingField1 = document.querySelector('#sensor_' + i + '_mapping1');
        sensorMappingField1.innerHTML = config['sensor_' + i + '_mapping1'];

        const sensorUnitField1 = document.querySelector('#sensor_' + i + '_unit1');
        sensorUnitField1.innerHTML = config['sensor_' + i + '_unit1'];

        const sensorMappingField2 = document.querySelector('#sensor_' + i + '_mapping2');
        sensorMappingField2.innerHTML = config['sensor_' + i + '_mapping2'];

        const sensorUnitField2 = document.querySelector('#sensor_' + i + '_unit2');
        sensorUnitField2.innerHTML = config['sensor_' + i + '_unit2'];
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
    let port_name = document.getElementById("port_input").value;
    console.log(port_name)
    handleForm(currentWindow, port_name)
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

renderGraphsButton.addEventListener('change', function(event) {
    event.preventDefault();
    if (!this.checked) {
        renderGraphs = false;
    } else {
        renderGraphs = true;
    }
});

submitNameButton.addEventListener("submit", function(event) {
    event.preventDefault(); // stop the form from submitting
});