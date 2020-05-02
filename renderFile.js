const {remote, ipcRenderer} = require('electron');
const {handleForm} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

const submitFormButton = document.querySelector("#portForm");
const responseParagraph = document.getElementById('response');
const renderGraphsButton = document.querySelector('#renderGraphsBtn');

renderGraphsButton.checked = true;

// Stores the current state of COM Port toggle
var portToggle = false;

// Decide whether to render graphs
var renderGraphs = true;

submitFormButton.addEventListener("submit", function(event){
        event.preventDefault();   // stop the form from submitting
        let port_name = document.getElementById("port_input").value;
        // console.log(port_name)
        handleForm(currentWindow, port_name)
});

ipcRenderer.on('form-received', function(event, args){
  responseParagraph.innerHTML = "Connected to " + args;
    /*
        you could choose to submit the form here after the main process completes
        and use this as a processing step
    */
});

ipcRenderer.on('action-port', function(event, args) {
  if(!portToggle) {
    document.getElementById("portContainer").setAttribute("class", "nav-item dropdown user-profile-dropdown order-lg-0 order-1 show")
    document.getElementById("userProfileDropdown").setAttribute("aria-expanded", "true");
    document.getElementById("containerFadeIn").setAttribute("class", "dropdown-menu position-absolute e-animated e-fadeInUp show")
    portToggle = true;
  }else {
    document.getElementById("portContainer").setAttribute("class", "nav-item dropdown user-profile-dropdown order-lg-0 order-1")
    document.getElementById("userProfileDropdown").setAttribute("aria-expanded", "false");
    document.getElementById("containerFadeIn").setAttribute("class", "dropdown-menu position-absolute e-animated e-fadeInUp")
    portToggle = false;
  }
})

renderGraphsButton.addEventListener('change', function(event) {
  console.log(submitFormButton.checked + ' boi');
  event.preventDefault();
  if(!this.checked) {
    renderGraphs = false;
  } else {
    renderGraphs = true;
  }
});

ipcRenderer.on('ser-data', function (event,data) {
  if(renderGraphs) {
    //Update acceleration chart
    chart1.updateSeries([{
      name: 'AccelX',
      data: data.split(',').slice(0, -2),
    }, {
        name: 'AccelY',
        data: data.split(',').slice(0, -2),
    }]);

    // Update state of charge chart
    d_2C_2.updateSeries([{
      name: 'Charge %',
      data: data.split(',').slice(0, -2),
    }]);

    // Updatee Motor RPM chart
    d_2C_1.updateSeries([{
      name: 'RPM',
      data: data.split(',').slice(0,-2),
    }]);
  } 
  responseParagraph.innerHTML = data;
});
