<template lang="pug">
    .wrapper
      .box.main-box
        .header.columns.is-gapless.is-multiline
          .column
              h1 Active Members - Report
          .column.is-2-desktop.is-12-tablet.has-text-right
            button.button.exp-btn
                img(src="~/assets/img/export-btn.png")
                | &nbsp;Export to PDF

        .body
          .section
            .set-reports-period-con
              b-field(horizontal label="Set reports period:")
                b-datepicker(placeholder="Select Start Date" icon="calendar-alt" expanded)
                b-datepicker(placeholder="Select End Date" icon="calendar-alt" expanded)
            line-chart
      .box.counter-box
          .columns.is-gapless.is-multiline
              .column.is-12-mobile.is-6-tablet.is-3-widescreen
                  h1 3000
                  h5 Registers Users
              .column.is-12-mobile.is-6-tablet.is-3-widescreen
                  h1 2535
                  h5 Pending Members
              .column.is-12-mobile.is-6-tablet.is-3-widescreen
                  .amount-wrapper
                      b Rs.
                      h1 1,563,000
                  h5 Paid Commissions
              .column.is-12-mobile.is-6-tablet.is-3-widescreen
                  .amount-wrapper
                      b Rs.
                      h1 1,563,000
                  h5 Un-Paid Commissions
</template>

<script>
import LineChart from '~/charts/LineChart.js'
    export default {
        layout: 'admin_layout',
        components: {
          LineChart
        }
    }
</script>

<style lang="sass" scoped>
  .set-reports-period-con
    margin-bottom: 3rem
    .field
      .label
        color: #666
</style>
