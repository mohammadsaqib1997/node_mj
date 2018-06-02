<template lang="pug">
    .wrapper
      .box.main-box
        .header.columns.is-gapless
          .column
              h1 Total Paid Commission - Report
        .body
          .section
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
    export default {
        layout: 'admin_layout'
    }
</script>
