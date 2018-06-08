<template lang="pug">
    .wrapper
      .box.main-box
        .header.columns.is-gapless.is-multiline
          .column
              h1 Total Paid Commission - Report
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
                  .amount-wrapepr
                      b Rs.
                      h1 1,563,000
                  h5 Paid Commissions
              .column.is-12-mobile.is-6-tablet.is-3-widescreen
                  .amount-wrapepr
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

<style lang="sass">
  $primary: #d9bd68
  $primary-light: rgba(217, 189, 104, 0.25)
  .set-reports-period-con
    margin-bottom: 3rem
    .field
      .label
        color: #666
    .datepicker
      .dropdown
        .has-text-primary
          color: $primary !important
        .pagination-previous:focus, .pagination-next:focus, .pagination-link:focus
          border-color: $primary
        .datepicker-table
          .datepicker-body
            .datepicker-row
              .datepicker-cell
                &.is-today
                  border: solid 1px $primary
                &.is-selected
                  background-color: $primary
        .select:not(.is-multiple):not(.is-loading)::after
          border-color: $primary
        .select
          select
            &:focus, &:active
              border-color: $primary
              box-shadow: 0 0 0 0.125em $primary-light

      .control
        .input
          border-radius: 0
          height: 2.8rem
          &:focus, &:active
            border-color: $primary
        .icon
          height: 2.8rem


</style>
