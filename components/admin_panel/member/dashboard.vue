<template lang="pug">
  .m-dashboard
    .box.counter-box
      .columns.is-gapless.is-multiline
        .column.is-12-mobile.is-6-tablet.is-3-widescreen
          .columns.is-gapless.level-cont.is-mobile
            .column
              h5 LEVEL.
            .column
              h1 4
        .column.is-12-mobile.is-6-tablet.is-3-widescreen
          .flex
            .va
              .tile.is-ancestor.ref-cont.is-parent
                .tile.is-vertical
                  .tile.is-child
                    span.acc 12291
                  .tile.is-child
                    span.acc 1200
                  .tile.is-child
                    span.acc 1200
                .tile.is-vertical
                  .tile.is-child
                    h5 Referrals
                  .tile.is-child
                    h5 Direct
                  .tile.is-child
                    h5 Indirect
                    
        .column.is-12-mobile.is-6-tablet.is-3-widescreen
          .amount-wrapepr
            b Rs.
            h1 1,563,000
          h5 Comission Paid

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
                        span.acc 25th Feb 2018
                      .tile.is-child
                        span.acc 25th Dec 2018
                    .tile.is-vertical.is-narrow
                      .tile.is-child
                        h5 Start
                      .tile.is-child
                        h5 End
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Registered Referrals
      .body
        .section
          .columns
            .column.is-4
              .content-des-1
                h1 Approved
                p 26,000
              .content-des-1
                h1 Pending
                p 3,000
              .content-des-1
                h1 Total
                p 29,000
            .column
              bar-chart(:height="300")
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Commission
      .body
        .section
          .columns
            .column.is-4
              .content-des-1
                h1 Paid Commissions
                p 26,000
              .content-des-1
                h1 Pending Commissions
                p 3,000
              .content-des-1
                h1 Total Paid
                p 29,000
            .column
              pie-chart(:height="300")
</template>

<script>
import BarChart from "~/charts/BarChart.js";
import PieChart from "~/charts/PieChart.js";
export default {
  components: {
    BarChart,
    PieChart
  }
};
</script>
