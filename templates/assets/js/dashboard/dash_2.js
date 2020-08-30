try {

  Apex.tooltip = {
    theme: 'dark'
  }

/*
    =============================
        Motor RPM | Options
    =============================
*/

var d_2options1 = {
  chart: {
    id: 'sparkline1',
    group: 'sparklines',
    type: 'area',
    height: 280,
    sparkline: {
      enabled: true
    },
  },
  colors: ['#009688'],
  stroke: {
      curve: 'smooth',
      width: 2
  },
  fill: {
    opacity: 1,
  },
  series: [{
    name: 'RPM',
    data: []
  }],
  yaxis: {
    labels: {
      formatter: function(value, index) {
        return (value)
      },
      offsetX: -22,
      offsetY: 0,
      style: {
          fontSize: '12px',
          fontFamily: 'Nunito, sans-serif',
          cssClass: 'apexcharts-yaxis-title',
      },
    }
  },
  grid: {
    padding: {
      top: 125,
      right: 0,
      bottom: 36,
      left: 0
    }, 
  },
  fill: {
      type:"gradient",
      gradient: {
          type: "vertical",
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: .40,
          opacityTo: .05,
          stops: [45, 100]
      }
  },
  tooltip: {
    enabled: true,
    x: {
      show: true,
    },
    theme: 'dark'
  },
  colors: ['#fff'],
  noData: {
    text: "No Data",
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      color: undefined,
      fontSize: '14px',
      fontFamily: undefined
    }
  }
}

/*
    =============================
        Charge | Options
    =============================
*/
var d_2options2 = {
  chart: {
    id: 'sparkline1',
    group: 'sparklines',
    type: 'area',
    height: 280,
    sparkline: {
      enabled: true
    },
  },
  stroke: {
      curve: 'smooth',
      width: 2
  },
  fill: {
    opacity: 1,
  },
  series: [{
    name: 'Charge %',
    data: []
  }],
  yaxis: {
    labels: {
      formatter: function(value, index) {
        return (value)
      },
      offsetX: -22,
      offsetY: 0,
      style: {
          fontSize: '12px',
          fontFamily: 'Nunito, sans-serif',
          cssClass: 'apexcharts-yaxis-title',
      },
    }
  },
  grid: {
    padding: {
      top: 125,
      right: 0,
      bottom: 36,
      left: 0
    }, 
  },
  fill: {
      type:"gradient",
      gradient: {
          type: "vertical",
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: .40,
          opacityTo: .05,
          stops: [45, 100]
      }
  },
  tooltip: {
    enabled: true,
    x: {
      show: true,
    },
    theme: 'dark'
  },
  colors: ['#fff'],
  noData: {
    text: "No Data",
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      color: undefined,
      fontSize: '14px',
      fontFamily: undefined
    }
  }
}

/*
    =================================
      GG Plot | Options
    =================================
*/
var options1 = {
  chart: {
    fontFamily: 'Nunito, sans-serif',
    height: 365,
    type: 'scatter',
    zoom: {
        enabled: true
    },
    toolbar: {
      show: true
    },
  },
  colors: ['#1b55e2' ],
  dataLabels: {
      enabled: false
  },
  title: {  
    text: '⠀',
    align: 'left',
    margin: 0,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: '25px',
      color:  '#bfc9d4'
    },
  },
  stroke: {
      show: true,
      curve: 'smooth',
      width: 0.1,
      lineCap: 'round'
  },
  series: [{
      name: 'AccelY',
      data: [[-16800, 16500], [16800, -17500], [-15500, -16200], [0, 0], [100, 300], [1500, 1700], [1700, 1600], [1900, 1950], [1600, 1000], [-1500, 1700], [1700, -1000], [-1400, -1800], [17000, 19000]]
  }],
  xaxis: {
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      show: true
    },
    labels: {
      offsetX: 0,
      offsetY: 0,
      style: {
          fontSize: '12px',
          fontFamily: 'Nunito, sans-serif',
          cssClass: 'apexcharts-xaxis-title',
          formatter: function(val) {
            return parseFloat(val).toFixed(1)
          }
      },
    }
  },
  yaxis: {
    labels: {
      formatter: function(value, index) {
        return (value)
      },
      offsetX: -22,
      offsetY: 0,
      style: {
          fontSize: '12px',
          fontFamily: 'Nunito, sans-serif',
          cssClass: 'apexcharts-yaxis-title',
      },
    }
  },
  grid: {
    borderColor: '#191e3a',
    strokeDashArray: 0.9,
    xaxis: {
        lines: {
            show: true
        }
    },   
    yaxis: {
        lines: {
            show: true,
        }
    },
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
    marker: {
      show: true,
    },
    x: {
      show: true,
    },
    y: {
      show: true,
    }
  },
  fill: {
    type: 'solid',
    pattern: {
      style: 'circles',
      strokeWidth: 0.1,
    },
  },
  annotations: {
    position: 'front' ,
    yaxis: [{
        y: 0,
        y2: null,
        strokeDashArray: 1,
        borderColor: '#c2c2c2',
        fillColor: '#c2c2c2',
        opacity: 0.3,
        offsetX: 0,
        offsetY: 0,
        yAxisIndex: 0,
    }],
    xaxis: [{
      x: 0,
      x2: null,
      strokeDashArray: 1,
      borderColor: '#c2c2c2',
      fillColor: '#c2c2c2',
      opacity: 0.3,
      offsetX: 0,
      offsetY: 0,
    }],
  },
  markers: {
    size: 1,
    colors: '#1b55e2',
    strokeColors: '#1b55e2',
    strokeWidth: 1,
    strokeOpacity: 1.0,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    shape: "circle",
    radius: 1,
    offsetX: 0,
    offsetY: 0,
}
}

/*
    ==================================
        Sales By Category | Options
    ==================================
*/
var sline = {
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false,
    },
  },tooltip: {
    enabled: false,
  },xaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false,
    },
    // type: 'numeric'
  },
  yaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false,
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  series: [{
    name: "Coordinates",
    data: []
  }],
  title: {
    show: false,
  },
  grid: {
    show: false,
  },
  noData: {
    text: "No Data",
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      color: undefined,
      fontSize: '14px',
      fontFamily: undefined
    }
  }
}

/*
    ==============================
    |    @Render Charts Script    |
    ==============================
*/


/*
    ============================
        Daily Sales | Render
    ============================
*/
var d_2C_1 = new ApexCharts(document.querySelector("#hybrid_followers3"), d_2options1);
    d_2C_1.render()

/*
    ============================
        Total Orders | Render
    ============================
*/
var d_2C_2 = new ApexCharts(document.querySelector("#total-orders"), d_2options2);
d_2C_2.render();

/*
    ================================
        Revenue Monthly | Render
    ================================
*/
var chart1 = new ApexCharts(
    document.querySelector("#revenueMonthly"),
    options1
);

chart1.render();

/*
    =================================
        Sales By Category | Render
    =================================
*/
var chart = new ApexCharts(
  document.querySelector("#s-line"),
  sline
);

chart.render();

} catch(e) {
    console.log(e);
}