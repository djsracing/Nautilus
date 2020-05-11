const {remote, ipcRenderer} = require('electron');
const {handleForm, mode, handleChangeMode} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

const submitFormButton = document.querySelector("#portForm");
const responseParagraph = document.getElementById('response');
const renderGraphsButton = document.querySelector('#renderGraphsBtn');
const submitMapButton = document.querySelector("#submit_map");

$(document).ready(async function(){
  // var {mode} = remote.require('./main');
  // App.init();
  if(mode=='light') {
      $('#mode').attr('value','Switch To Night Mode');
      $('link#plugins').attr('href','assets/css/plugins-light.css');
      $('link#dash').attr('href','assets/css/dashboard/dash_2-light.css');
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
          $('link#dash').attr('href','assets/css/dashboard/dash_2-dark.css');
          handleChangeMode(currentWindow, 'dark');
      }else {
          $('#mode').attr('value','Switch To Night Mode');
          $('link#plugins').attr('href','assets/css/plugins-light.css');
          $('link#dash').attr('href','assets/css/dashboard/dash_2-light.css');
          handleChangeMode(currentWindow, 'light');
      }
  });
});

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
  // console.log(submitFormButton.checked + ' boi');
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
