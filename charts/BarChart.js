import {Bar} from 'vue-chartjs'

export default {
  extends: Bar,
  mounted () {
    this.renderChart(this.data, this.options)
  },
  data () {
    return {
      data: {
        labels: ['January', 'February', 'March'],
        datasets: [
          {
            label: 'Defalt',
            data: [0, 0, 0]
          },
          {
            label: 'Step 1',
            backgroundColor: '#dcdcdc',
            data: [50, 60, 60]
          },
          {
            label: 'Step 2',
            backgroundColor: '#3d3e5a',
            data: [60, 80, 90]
          },
        ]
      },
      options: {responsive: true, maintainAspectRatio: false}
    }
  }
}
