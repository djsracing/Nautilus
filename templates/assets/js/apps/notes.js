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
    }
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
    data: [0]
  }],
  title: {
    show: false,
  },
  grid: {
    show: false,
  },
}

var chart = new ApexCharts(
  document.querySelector("#s-line"),
  sline
);

chart.render();