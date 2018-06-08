import {Line} from 'vue-chartjs'

export default {
  extends: Line,
  mounted () {
    this.renderChart(this.data, this.options)
  },
  data () {
    return {
      data: {
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        datasets: [
          {
            label: 'PAID',
            backgroundColor: '#d9bd68',
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
            ]
          },
            {
              label: 'UN-PAID',
              backgroundColor: '#333',
              data: [
                this.getRandomInt(),
                this.getRandomInt(),
                this.getRandomInt(),
                this.getRandomInt(),
                this.getRandomInt(),
                this.getRandomInt(),
                this.getRandomInt(),
                this.getRandomInt(),
                this.getRandomInt(),
                this.getRandomInt(),
                this.getRandomInt(),
                this.getRandomInt(),
              ]
            },
        ]
      },
      options: {responsive: true, maintainAspectRatio: false}
    }
  },
  methods: {
    getRandomInt () {
        return Math.floor(Math.random() * (100 - 5 + 1)) + 5
      }
  }
}
