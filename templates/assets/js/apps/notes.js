var sline = {
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    },
    toolbar: {
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
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }],
  title: {
    show: false,
  },
  grid: {
    show: false,
  },
  xaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false,
    }
  }
}

var chart = new ApexCharts(
  document.querySelector("#s-line"),
  sline
);

chart.render();