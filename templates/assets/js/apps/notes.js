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
    events: {
      mounted: function(ctx, config) {
        const len = ctx.w.config.series[0].data.length;
        // console.log(ctx.w.config.series[0].data[len-1]);
        // const highest1 = ctx.w.config.series[0].data[len-1];
        const highest1 = ctx.getHighestValueInSeries(0);

        ctx.addPointAnnotation({
          x: new Date(ctx.w.globals.seriesX[0][ctx.w.globals.series[0].indexOf(highest1)]).getTime(),
          y: highest1,
          label: {
            style: {
              cssClass: 'd-none'
            }
          },
          customSVG: {
              SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#1b55e2" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
              cssClass: undefined,
              offsetX: -8,
              offsetY: 5
          }
        })

        // ctx.addPointAnnotation({
        //   x: new Date(ctx.w.globals.seriesX[1][ctx.w.globals.series[1].indexOf(highest2)]).getTime(),
        //   y: highest2,
        //   label: {
        //     style: {
        //       cssClass: 'd-none'
        //     }
        //   },
        //   customSVG: {
        //       SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#e7515a" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
        //       cssClass: undefined,
        //       offsetX: -8,
        //       offsetY: 5
        //   }
        // })
      },
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