import {Pie} from 'vue-chartjs'

export default {
  extends: Pie,
  mounted () {
    this.renderChart(this.data, this.options)
  },
  data () {
    return {
      data: {
        labels: ['Paid Commission', 'UnPaid Commission'],
        datasets: [
          {
            backgroundColor: ['#d9bd68', '#3d3e5a'],
            data: [60, 100]
          },
        ]
      },
      options: {responsive: true, maintainAspectRatio: false}
    }
  }
}
