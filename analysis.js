const {remote, ipcRenderer} = require('electron');
const {handleChangeMode, mode, requestSessionData} = remote.require('./main');
const currentWindow = remote.getCurrentWindow();
var {config} = remote.getGlobal('sharedObj');

var charts = [];

function initPage() {
    // for (var i = 1; i <= 35; i++) {
    //     const sensorField = document.querySelector('#sensor_' + i);
    //     sensorField.innerHTML = config['Sensor #' + i];
    // }
}

function drawCharts(lap) {
  let session = requestSessionData(currentWindow);
  if(lap == 0 || session[lap] == undefined)
    return;

  let sensorSelected = $("#sensors").val();
  console.log(sensorSelected);
  charts = [];

  let counter = 0;

  for(let i = 0; i < sensorSelected.length; i++) {
    let sensors = config[sensorSelected[i]];
    for(let j = 0 ; j < sensors.length; j++) {
      let node = document.createElement("DIV");
      node.setAttribute('id', 'mapSubDiv' + eval(counter));
      document.getElementById("mapDiv").appendChild(node);
      
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
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 1,
          lineCap: 'square'
        },
        series: [{
          name: "Data",
          data: []
        }],
        title: {  
            text: config[sensors[j]],
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
          categories: [],
          labels: {
            show: true
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

      let chart = new ApexCharts(
        document.querySelector("#mapSubDiv" + eval(counter)),
        sline
      );
      chart.render();
      charts.push(chart);
      counter++;
    }
  }
}

$(document).ready(async function(){
    initPage();
    if(mode=='light') {
        $('#mode').attr('value','Switch To Night Mode');
        $('link#plugins').attr('href','assets/css/plugins-light.css');
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
            handleChangeMode(currentWindow, 'dark');
        }else {
            $('#mode').attr('value','Switch To Night Mode');
            $('link#plugins').attr('href','assets/css/plugins-light.css');
            handleChangeMode(currentWindow, 'light');
        }
        await delay(800);
        var load_screen = document.getElementById("load_screen");
        load_screen.parentNode.removeChild(load_screen);
    });
});
