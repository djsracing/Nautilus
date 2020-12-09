const {remote, ipcRenderer} = require('electron');
const {handleChangeMode, mode, requestSessionData} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
var {config} = remote.getGlobal('sharedObj');
var {session} = remote.require('./main');
var lapCount = 0;

const loadSessionBtn = document.querySelector('#loadSessionBtn');

function clickCallback(path) {
  const fs = require('fs');
  const Swal = require('sweetalert2');
  try{
    session = JSON.parse(fs.readFileSync(path, 'utf8'));
    if(session != null){
      let nLaps = Object.keys(session).length;
      for(let i = 0; i < nLaps; i++) {
        let node = document.createElement("option");
        node.setAttribute('value', eval(i + 1));
        node.innerHTML = 'Lap ' + eval(i + 1);
        document.getElementById("lapSelect").appendChild(node);
      }
    }else {
      Swal.fire('Bad file format');
      return;
    }
    Swal.fire('Successful');
  }catch (e) {
    Swal.fire('Bad file format');
  }
}

let sline = {
  chart: {
    height: 400,
    type: 'line',
    zoom: {
      enabled: true
    },
    toolbar: {
      show: true,
    },
    dropShadow: {
      enabled: true,
      opacity: 0.2,
      blur: 5,
      left: -7,
      top: 17
    },
    foreColor: '#ededed'
  },
  colors: ['#1b55e2', '#e7515a'],
  markers: {
      discrete: [{
      seriesIndex: 0,
      dataPointIndex: 7,
      fillColor: '#000',
      strokeColor: '#000',
      size: 5
    }, {
      seriesIndex: 2,
      dataPointIndex: 11,
      fillColor: '#000',
      strokeColor: '#000',
      size: 4
    }]
  },
  stroke: {
    curve: 'smooth',
    width: 1,
    lineCap: 'round'
  },
  series: [{
    name: undefined,
    data: undefined
  }],
  title: {  
      text: undefined,
      align: 'left',
      margin: 0,
      offsetX: -10,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: '15px',
        color:  '#bfc9d4'
      },
  },
  grid: {
    show: false,
    row: {
      colors: ['#464B5D', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    type: 'numeric',
    labels: {
      show: true,
      format: 'fff',
      tickAmount: undefined
    },
    title: {
      text: 'Time'
    }
  },
  yaxis: {
    title: {
      text: 'Value'
    }
  },
  legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -50,
      fontSize: '16px',
      fontFamily: 'Nunito, sans-serif',
      markers: {
        width: 10,
        height: 10,
        strokeWidth: 0,
        strokeColor: '#fff',
        fillColors: undefined,
        radius: 12,
        onClick: undefined,
        offsetX: 0,
        offsetY: 0
      },    
      itemMargin: {
        horizontal: 0,
        vertical: 20
      }
  },
  tooltip: {
      enabled: true,
      theme: 'dark',
      marker: {
        show: true,
      },
      x: {
        show: true,
      }
  },
};

function initPage() {
  if(session != null){
    let nLaps = Object.keys(session).length;
    for(let i = 0; i < nLaps; i++) {
      let node = document.createElement("option");
      node.setAttribute('value', eval(i + 1));
      node.innerHTML = 'Lap ' + eval(i + 1);
      document.getElementById("lapSelect").appendChild(node);
    }
  }
}

function drawCharts(lap) {
  // session = requestSessionData(currentWindow);
  if(lap == 0 || session[lap] == undefined)
    return;

  let sensorSelected = $("#sensors").val();
  console.log('Lap chosen: ' + lap + 'Session: ' + session);

  let counter = 0;
  document.getElementById("mapDiv").innerHTML = '';

  for(let i = 0, len1 = sensorSelected.length; i < len1; ++i) {
    let sensors = config[sensorSelected[i]];
    for(let j = 0, len2 = sensors.length; j < len2; ++j) {
      let node = document.createElement("DIV");
      node.setAttribute('id', 'mapSubDiv' + eval(counter));
      document.getElementById("mapDiv").appendChild(node);
      
      let data = [];

      let indx = sensors[j].substring(8);
      let interval = 0.0;

      for(let k = 0, len3 = session[lap].length; k < len3; ++k) {
        data.push([interval, session[lap][k][indx - 1] * 1.03]);
        interval += 0.2;
      }

      sline.series[0].name = config[sensors[j] + '_unit1'];
      sline.series[0].data = data;
      sline.title.text = config[sensors[j]];
      sline.xaxis.labels.tickAmount = Math.round(interval);

      let chart = new ApexCharts(
        document.querySelector("#mapSubDiv" + eval(counter)),
        sline
      );
      // charts.push(chart);
      counter++;
      chart.render();
    }
  }
  // for(let i = 0, len = charts.length; i < len; i++) {
    // charts[i].render();
  // }
}

initPage();

$(document).ready(async function(){
    initPage();
    if(mode=='light') {
      $('#mode').attr('value','Switch To Night Mode');
      $('link#plugins').attr('href','assets/css/plugins-light.css');
      $('link#select2').attr('href','plugins/select2/select2.min-light.css');
      $('link#swal').attr('href','plugins/sweetalerts/sweetalert2-light.min.css');
      $('link#steps').attr('href','plugins/jquery-step/jquery.steps-light.css');
      $('link#fileUpload').attr('href','plugins/file-upload/file-upload-with-preview-light.min.css');
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
            $('link#select2').attr('href','plugins/select2/select2.min-dark.css');
            $('link#swal').attr('href','plugins/sweetalerts/sweetalert2-dark.min.css');
            $('link#steps').attr('href','plugins/jquery-step/jquery.steps-dark.css');
            $('link#fileUpload').attr('href','plugins/file-upload/file-upload-with-preview-dark.min.css');
            handleChangeMode(currentWindow, 'dark');
        }else {
            $('#mode').attr('value','Switch To Night Mode');
            $('link#plugins').attr('href','assets/css/plugins-light.css');
            $('link#select2').attr('href','plugins/select2/select2.min-light.css');
            $('link#swal').attr('href','plugins/sweetalerts/sweetalert2-light.min.css');
            $('link#steps').attr('href','plugins/jquery-step/jquery.steps-light.css');
            $('link#fileUpload').attr('href','plugins/file-upload/file-upload-with-preview-light.min.css');
            handleChangeMode(currentWindow, 'light');
        }
        await delay(800);
        var load_screen = document.getElementById("load_screen");
        load_screen.parentNode.removeChild(load_screen);
    });
});
