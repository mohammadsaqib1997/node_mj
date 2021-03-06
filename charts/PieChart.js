import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
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
  }
}
