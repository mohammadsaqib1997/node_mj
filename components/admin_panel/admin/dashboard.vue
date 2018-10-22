<template lang="pug">
  .admin-dashboard
    countSts
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Members
      .body
        .section
          .columns
            .column.is-4
              .content-des-1
                h1 Paid
                p {{ paid_mem }}
              .content-des-1
                h1 Pending
                p {{ un_paid_mem }}
              .content-des-1
                h1 Total
                p {{ paid_mem+un_paid_mem }}
            .column
              bar-chart(:height="300" :ren_data="bar_data")
          b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Commissions
      .body
        .section
          .columns
            .column.is-4
              .content-des-1
                h1 Paid Commissions
                p {{ paid_cm }}
              .content-des-1
                h1 Un-Paid Commissions
                p {{ un_paid_cm }}
              .content-des-1
                h1 Total Commissions
                p {{ paid_cm+un_paid_cm }}
            .column
              pie-chart(:height="300" :ren_data="pie_chart_data")
          b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
import moment from "moment";
import _ from "lodash";
import BarChart from "~/charts/BarChart.js";
import PieChart from "~/charts/PieChart.js";
import countSts from "~/components/admin_panel/admin/count-sts.vue";
export default {
  components: {
    BarChart,
    PieChart,
    countSts
  },
  async mounted() {
    const self = this;
    self.loading = true;
    await self.$axios
      .get("/api/admin/monthly_reg_members")
      .then(res => {
        let data = res.data.data;
        let labels = [];
        let datasets = [
          {
            label: "Paid",
            backgroundColor: "#dcdcdc",
            data: []
          },
          {
            label: "Pending",
            backgroundColor: "#3d3e5a",
            data: []
          }
        ];
        for (let month in data) {
          let m_text = moment()
            .set("month", parseInt(month) - 1)
            .format("MMMM");
          labels.push(m_text);

          self.paid_mem += _.get(data, month + ".paid", 0);
          self.un_paid_mem += _.get(data, month + ".un_paid", 0);

          datasets[0].data.push(_.get(data, month + ".paid", 0));
          datasets[1].data.push(_.get(data, month + ".un_paid", 0));
        }
        self.bar_data = { labels, datasets };
      })
      .catch(err => {
        console.log(err);
      });
    await self.$axios
      .get("/api/admin/total_cm")
      .then(res => {
        self.paid_cm = res.data.paid;
        self.un_paid_cm = res.data.un_paid;
        self.pie_chart_data = {
          labels: ["Paid Commission", "Un-Paid Commission"],
          datasets: [
            {
              backgroundColor: ["#d9bd68", "#3d3e5a"],
              data: [self.paid_cm, self.un_paid_cm]
            }
          ]
        };
      })
      .catch(err => {
        console.log(err);
      });
    self.loading = false;
  },
  data() {
    return {
      loading: false,
      bar_data: {},
      pie_chart_data: {},
      paid_mem: 0,
      un_paid_mem: 0,
      paid_cm: 0,
      un_paid_cm: 0
    };
  }
};
</script>
