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
    type: 'numeric'
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

var mapLine = {
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
    type: 'numeric'
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

var chart = new ApexCharts(
  document.querySelector("#s-line"),
  sline
);

var mapChart = new ApexCharts(
  document.querySelector("#mapChart"),
  mapLine
);

chart.render();
mapChart.render();