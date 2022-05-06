<script>
import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
        },
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              precision: 5, // точность округления
              maxTicksLimit: 10,
            },
          }],
          xAxes: [{
            display: true,
            ticks: {
              precision: 5,
              maxTicksLimit: 14,
            },
          }],
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  },
};
</script>
