const {remote, ipcRenderer} = require('electron');
const {handleForm, mode, handleChangeMode, handleConnectToCloud, handleDisconnectToCloud} = remote.require('./main');
var {config, trackMap, connectedToCloud, connectedToSer, cloudURL, serPortName, globalMap} = remote.getGlobal('sharedObj');
const currentWindow = remote.getCurrentWindow();

const renderGraphsButton = document.querySelector('#renderGraphsBtn');
const connectToCloudForm = document.querySelector("#cloudForm");

var charge_data = [];
var rpm_data = [];
var length = 0;

function initPage() {
  chart.updateSeries([{
    data:globalMap
  }]);
}

initPage();

$(document).ready(async function(){
  if(mode=='light') {
      $('#mode').attr('value','Switch To Night Mode');
      $('link#plugins').attr('href','assets/css/plugins-light.css');
      $('link#dash').attr('href','assets/css/dashboard/dash_2-light.css');
      $('link#modals').attr('href','assets/css/components/custom-modal-light.css');
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
      $('link#dash').attr('href','assets/css/dashboard/dash_2-dark.css');
      $('link#modals').attr('href','assets/css/components/custom-modal-dark.css');
      handleChangeMode(currentWindow, 'dark');
    }else {
      $('#mode').attr('value','Switch To Night Mode');
      $('link#plugins').attr('href','assets/css/plugins-light.css');
      $('link#dash').attr('href','assets/css/dashboard/dash_2-light.css');
      $('link#modals').attr('href','assets/css/components/custom-modal-light.css');
      handleChangeMode(currentWindow, 'light');
    }
    await delay(800);
    var load_screen = document.getElementById("load_screen");
    load_screen.parentNode.removeChild(load_screen);
  });
});

renderGraphsButton.checked = true;

// Stores the current state of COM Port toggle
var portToggle = false;

// Decide whether to render graphs
var renderGraphs = true;

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
  event.preventDefault();
  if(!this.checked) {
    renderGraphs = false;
  } else {
    renderGraphs = true;
  }
});

ipcRenderer.on('ser-data', function (event, data) {
  if(renderGraphs) {
    //Update GG Plot
    chart1.appendSeries([{
      name: 'AccelX',
      data: [data[0], data[1]],
    }]);

    // Update state of charge chart
    charge_data.push(data[2]);
    rpm_data.push(data[3]);
    length++;

    if(length > 60 * 5) {
      charge_data.shift();
    }
    if(length > 60 * 5) {
      rpm_data.shift();
      length = 0;
    }
    d_2C_2.updateSeries([{
      name: 'Charge %',
      data: charge_data,
    }]);

    // Updatee Motor RPM chart
    d_2C_1.updateSeries([{
      name: 'RPM',
      data: rpm_data,
    }]);
    
    $("#brakePressure").attr('style', 'width:'+eval(data[10]*10)+'%');
    $("#steeringAngle").attr('style', 'width:'+eval(data[11]*10)+'%');
    $("#cellTemp").attr('style', 'width:'+eval(data[12]*10)+'%');
  }
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
