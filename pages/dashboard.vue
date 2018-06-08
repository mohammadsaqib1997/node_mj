<template lang="pug">
    .wrapper
      .box.counter-box
          .columns.is-gapless.is-multiline
              .column.is-12-mobile.is-6-tablet.is-3-widescreen
                  h1 3000
                  h5 Registers Users
              .column.is-12-mobile.is-6-tablet.is-3-widescreen
                  h1 2535
                  h5 Pending Members
              .column.is-12-mobile.is-6-tablet.is-3-widescreen
                  .amount-wrapepr
                      b Rs.
                      h1 1,563,000
                  h5 Paid Commissions
              .column.is-12-mobile.is-6-tablet.is-3-widescreen
                  .amount-wrapepr
                      b Rs.
                      h1 1,563,000
                  h5 Un-Paid Commissions
      .box.main-box
          .header.columns.is-gapless
              .column
                  h1 Registered Members
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
import BarChart from '~/charts/BarChart.js'
import PieChart from '~/charts/PieChart.js'
    export default {
        layout: 'admin_layout',
        components: {
          BarChart,
          PieChart
        }
    }
</script>

<style scoped lang="sass">
  .content-des-1
    margin-bottom: 1.2rem
    h1
      color: #3d3e5a
      text-transform: uppercase
      font-size: 24px
      font-weight: bold
      margin-bottom: 0.4rem
    p
      color: #969595
</style>
