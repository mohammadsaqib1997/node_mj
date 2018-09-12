<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless.is-multiline
        .column
          h1 Total Finances - Report
        .column.is-2-desktop.is-12-tablet.has-text-right
          button.button.exp-btn(v-if="start_date !== null && end_date !== null" @click.prevent="genReport")
            img(src="~/assets/img/export-btn.png")
            | &nbsp;Export to Excel

      .body
        .section
          .set-reports-period-con
            b-field(horizontal label="Set reports period:")
              b-datepicker(placeholder="Select Start Date" v-model="start_date" :max-date="max_date" icon="calendar-alt" expanded )
                button.button.is-danger.is-small(v-if="start_date !== null" @click.prevent="start_date=null")
                  b-icon(icon="times-circle")
                  span Clear
              b-datepicker(placeholder="Select End Date" v-model="end_date" :min-date="min_date" icon="calendar-alt" expanded)
                button.button.is-danger.is-small(v-if="end_date !== null" @click.prevent="end_date=null")
                  b-icon(icon="times-circle")
                  span Clear
            line-chart(:ren_data="line_chart_data")
        b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
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
    self.loading = true;
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
    self.loading = false;
  },
  computed: {
    min_date: function() {
      if (this.start_date !== null) {
        return new Date(moment(this.start_date).add(1, "d"));
      } else {
        return null;
      }
    },
    max_date: function() {
      if (this.end_date !== null) {
        return new Date(moment(this.end_date).subtract(1, "d"));
      } else {
        return null;
      }
    }
  },
  data() {
    return {
      start_date: null,
      end_date: null,
      line_chart_data: {},
      loading: false
    };
  },
  methods: {
    async genReport() {
      const self = this;
      self.loading = true;
      await self
        .$axios({
          url: `/api/report/finance/${moment(self.start_date).format(
            "YYYY-MM-DD"
          )}/${moment(self.end_date).format("YYYY-MM-DD")}`,
          method: "GET",
          responseType: "blob"
        })
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.getElementById("download_anc");
          if (!link) {
            link = document.createElement("a");
            link.id = "download_anc";
          }
          link.href = url;
          link.setAttribute("download", `finance_report.${moment(self.start_date).format("YYYY-MM-DD")}-${moment(self.end_date).format("YYYY-MM-DD")}.csv`);
          if (!document.getElementById("download_anc")) {
            document.body.appendChild(link);
          }
          link.click();
          let el = document.getElementById("download_anc");
          el.parentNode.removeChild(el);
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.set-reports-period-con {
  margin-bottom: 3rem;
  .field {
    .label {
      color: #666;
    }
  }
}

.box.main-box {
  position: relative;
  overflow: hidden;
}
</style>
