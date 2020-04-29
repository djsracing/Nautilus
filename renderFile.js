const { remote, ipcRenderer } = require('electron');
const { handleForm} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

const submitFormButton = document.querySelector("#portForm");
const responseParagraph = document.getElementById('response');

// Stores the current state of COM Port toggle
var portToggle = false;

submitFormButton.addEventListener("submit", function(event){
        event.preventDefault();   // stop the form from submitting
        let port_name = document.getElementById("port_input").value;
        // console.log(port_name)
        handleForm(currentWindow, port_name)
});

ipcRenderer.on('form-received', function(event, args){
  responseParagraph.innerHTML = args
    /*
        you could choose to submit the form here after the main process completes
        and use this as a processing step
    */
});

ipcRenderer.on('action-port', function(event, args) {
  if(portToggle==false) {
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

var labels_dat = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
var series_dat = [12, 17, 7, 17, 23, 18, 38];

ipcRenderer.on('ser-data', function (event,data) {
    responseParagraph.innerHTML = data;
    labels_dat.push('M');
    series_dat.push(Number(data.split(',')[0]));

    dataDailySalesChart = {
        labels: labels_dat,
        series: [
          series_dat
        ]
      };

    optionsDailySalesChart = {
      chartPadding: {
        top: 0,
        right: 0,
        bottom: -25,
        left: -35
      },axisX: {
          showGrid: true,
          showLabel: false
      },
      axisY: {
          showGrid: true,
          showLabel: false
      },
      showPoint: false,
      lineSmooth: true,
      fullWidth: true
    }
    dailySalesChart = null;
    dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);
});
