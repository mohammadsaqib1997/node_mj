import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  mounted() {
    this.renderChart(this.ren_data, this.options)
  },
  watch: {
    ren_data: function (val) {
      this.renderChart(val, this.options)
    }
  },
  props: {
    ren_data: {
      default: () => ({}),
      type: Object
    }
  },
  data() {
    return {
      options: { responsive: true, maintainAspectRatio: false }
    }
  },
}
