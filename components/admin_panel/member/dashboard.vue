<template lang="pug">
  .m-dashboard
    .box.counter-box
      .columns.is-gapless.is-multiline
        .column.is-12-mobile.is-6-tablet.is-3-widescreen
          .columns.is-gapless.level-cont.is-mobile
            .column
              h5 LEVEL.
            .column
              h1 {{ level }}
        .column.is-12-mobile.is-6-tablet.is-3-widescreen
          .flex
            .va
              .tile.is-ancestor.ref-cont.is-parent
                .tile.is-vertical
                  .tile.is-child
                    span.acc {{ total_ref }}
                  .tile.is-child
                    span.acc {{ direct_ref }}
                  .tile.is-child
                    span.acc {{ in_direct_ref }}
                .tile.is-vertical
                  .tile.is-child
                    h5 Referrals
                  .tile.is-child
                    h5 Direct
                  .tile.is-child
                    h5 Indirect
                      
        .column.is-12-mobile.is-6-tablet.is-3-widescreen
          .flex
            .wallet
              span.txt Rs. {{ wallet }}/-
              h3.heading Shopping Wallet
            // table.table
            //   tbody
            //     tr
            //       td.vert.hd2.s1.has-text-right Rs. {{ wallet }}/-
            //       td.vert.hd1.s1 Shopping Wallet
            //     // tr
            //     //   td.vert.hd2.s1.has-text-right Rs. 0/-
            //     //   td.vert.hd1.s1 Wallet

        .column.is-12-mobile.is-6-tablet.is-3-widescreen
          .flex
            .va
              .tile.is-ancestor.pack-cont
                .tile.is-vertical
                  .tile.is-child
                    span.acc Package Activiation
                  .tile.is-parent
                    .tile.is-vertical
                      .tile.is-child
                        span.acc {{ start_package }}
                      .tile.is-child
                        span.acc {{ end_package }}
                    .tile.is-vertical.is-narrow
                      .tile.is-child
                        h5 Start
                      .tile.is-child
                        h5 End
      b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Registered Referrals
      .body
        .section
          .columns.is-multiline
            .column.is-12.is-6-fullhd
              .columns
                .column.is-narrow
                  .content-des-1
                    h1 Paid
                    p {{ tot_paid_r }}
                  .content-des-1
                    h1 Pending
                    p {{ tot_pend_r }}
                  .content-des-1
                    h1 Total
                    p {{ tot_paid_r + tot_pend_r }}
                .column
                  bar-chart(:height="300" :ren_data="bar_data")
                b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
            .column.is-12.is-6-fullhd
              .box.bal-cont
                table.table.is-fullwidth
                  thead
                    tr
                      th.has-text-centered(colspan='2')
                        | Finance
                  tbody
                    tr
                      td Available Balance:
                      td.has-text-right PKR {{ mem_var.available }}/-
                    tr
                      td Pending Balance:
                      td.has-text-right PKR {{ mem_var.pending }}/-
                    tr
                      td Additional Fees:
                      td.has-text-right PKR {{ mem_var.paid_tax }}/-
                    tr
                      td
                        nuxt-link(to="/fund-manager/finance-details") Account Summary
                      td.has-text-right
                        nuxt-link(to="/withdraw") Withdraw
</template>

<script>
import BarChart from "~/charts/BarChart.js";
import moment from "moment";
import _ from "lodash";
export default {
  components: {
    BarChart
  },
  async mounted() {
    const self = this;
    self.loading = true;
    await self.$axios
      .get("/api/member/user_info/" + self.$store.state.user.data.user_id)
      .then(res => {
        let data = res.data.data;
        if (!_.isEmpty(data)) {
          self.level = data.level;
          self.wallet = data.wallet;
          self.direct_ref = data.direct_ref_count;
          self.in_direct_ref = data.in_direct_ref_count;
          let pck_data = moment(data.package_act_date);
          self.start_package = pck_data.format("DD MMM YYYY");
          self.end_package = pck_data
            .clone()
            .add(1, "year")
            .format("DD MMM YYYY");
        }
      })
      .catch(err => {
        console.log(err);
      });
    await self.$axios
      .get("/api/member/get_referrals/" + self.$store.state.user.data.user_id)
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

          self.tot_paid_r += _.get(data, month + ".paid", 0);
          self.tot_pend_r += _.get(data, month + ".un_paid", 0);

          datasets[0].data.push(_.get(data, month + ".paid", 0));
          datasets[1].data.push(_.get(data, month + ".un_paid", 0));
        }
        self.bar_data = { labels, datasets };
      })
      .catch(err => {
        console.log(err);
      });
    await self.loadAvlb();
    self.loading = false;
  },
  computed: {
    total_ref: function() {
      return parseInt(this.direct_ref) + parseInt(this.in_direct_ref);
    }
  },
  data() {
    let date = moment();
    return {
      loading: false,
      mem_var: {
        available: 0,
        pending: 0,
        paid_tax: 0
      },
      bar_data: {},
      tot_paid_r: 0,
      tot_pend_r: 0,
      level: 0,
      wallet: 0,
      direct_ref: 0,
      in_direct_ref: 0,
      start_package: date.format("DD MMM YYYY"),
      end_package: date
        .clone()
        .add(1, "year")
        .format("DD MMM YYYY")
    };
  },
  methods: {
    async loadAvlb() {
      const self = this;
      await self.$axios
        .get("/api/profile/load_fin_var")
        .then(async res => {
          if (res.data.result) {
            self.mem_var = {
              available: parseInt(res.data.result["available"]),
              pending: parseInt(res.data.result["pending"]),
              paid_tax: parseInt(res.data.result["paid_tax"])
            };
          }
        })
        .catch(err => {
          self.$toast.open({
            duration: 3000,
            message: `Server Error!`,
            position: "is-bottom",
            type: "is-danger"
          });
        });
    }
  }
};
</script>

<style scoped lang="scss">
.m-dashboard {
  .flex {
    .table {
      background-color: transparent;
      td {
        padding: 5px;
        border: 0;
        &.vert {
          vertical-align: middle;
        }
        &.hd1 {
          font-weight: 700;
          font-size: 20px;
          text-transform: uppercase;
          color: #d9bd68;
        }
        &.hd2 {
          color: white;
          font-weight: 600;
          font-size: 18px;
          text-transform: uppercase;
        }
        &.hd1,
        &.hd2 {
          &.s1 {
            font-size: 15px;
            font-weight: 500;
          }
          &.s2 {
            font-size: 30px;
            line-height: 25px;
            font-weight: 700;
          }
        }
      }
    }
    .wallet {
      .txt {
        font-size: 30px;
        color: #d9bd68;
      }
      .heading {
        font-size: 20px;
        color: white;
        font-weight: 500;
      }
    }
  }
}
.box.counter-box {
  position: relative;
}
.box.bal-cont {
  height: 100%;
  /deep/ {
    table.table {
      height: 100%;
      thead {
        th {
          text-transform: uppercase;
          font-size: 18px;
          font-weight: 500;
        }
      }
      td {
        vertical-align: middle;
        text-transform: uppercase;
        a {
          color: #d9bd68;
        }
      }
    }
  }
}
</style>

