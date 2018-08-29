<template lang="pug">
	.wrapper
		.box.main-box
			.header.columns.is-gapless.is-multiline
				.column
						h1 Total Finances - Report
				.column.is-2-desktop.is-12-tablet.has-text-right
					button.button.exp-btn
							img(src="~/assets/img/export-btn.png")
							| &nbsp;Export to Excel

			.body
				.section
					.set-reports-period-con
						b-field(horizontal label="Set reports period:")
							b-datepicker(placeholder="Select Start Date" icon="calendar-alt" expanded)
							b-datepicker(placeholder="Select End Date" icon="calendar-alt" expanded)
						line-chart(:ren_data="line_chart_data")
		count-sts
</template>

<script>
import moment from "moment";
import _ from "lodash";
import LineChart from "~/charts/LineChart.js";
import countSts from "~/components/admin_panel/admin/count-sts.vue";
export default {
  layout: "admin_layout",
  components: {
    LineChart,
    countSts
  },
  async mounted() {
    const self = this;
    await self.$axios
      .get("/api/commission/monthly_data")
      .then(res => {
        let data = res.data.data;
        let labels = [];
        let datasets = [
          {
            label: "PAID",
            backgroundColor: "#d9bd6880",
            data: []
          },
          {
            label: "UN-PAID",
            backgroundColor: "#33333380",
            data: []
          }
				];
				for (let month in data) {
          let m_text = moment()
            .set("month", parseInt(month) - 1)
            .format("MMMM");
          labels.push(m_text);

          datasets[0].data.push(_.get(data, month + ".paid", 0));
          datasets[1].data.push(_.get(data, month + ".un_paid", 0));
        }
        self.line_chart_data = { labels, datasets };
      })
      .catch(err => {
        console.log(err);
      });
  },
  data() {
    return {
			line_chart_data: {}
		};
  }
};
</script>

<style lang="sass" scoped>
  .set-reports-period-con
    margin-bottom: 3rem
    .field
      .label
        color: #666
</style>
