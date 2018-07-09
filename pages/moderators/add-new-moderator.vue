<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Add Moderator
      .body
        .section
          .form
            .columns.is-variable.is-1
              .column.is-3
                label ID
              .column
                b-field
                  b-input(type="text" placeholder="992233")
              .column
                b-field
                  b-input(type="text" placeholder="Generated Username")
            .columns.is-variable.is-1
              .column.is-3
                label Full Name
              .column
                b-field
                  b-input(type="text" placeholder="(example: Shabir Ahmed)")
            .columns.is-variable.is-1
              .column.is-3
                label Date Of Birth
              .column
                b-field
                  b-datepicker(placeholder="DD/MM/YY" expanded)
            .columns.is-variable.is-1
              .column.is-3
                label Password
              .column
                b-field
                  b-input(type="password" placeholder="******")
            .columns.is-variable.is-1
              .column.is-3
                label Re-Type Password
              .column
                b-field
                  b-input(type="password" placeholder="******")
            .columns.is-variable.is-1
              .column.is-3
                label CNIC
              .column
                b-field
                  b-input(type="text" placeholder="xxxxx-xxxxxxx-x")
            .columns.is-variable.is-1
              .column.is-3
                label Email
              .column
                b-field
                  b-input(type="text" placeholder="user@domain.com")
            .columns.is-variable.is-1
              .column.is-3
                label Contact Number
              .column
                b-field
                  b-input(type="text" placeholder="000-000-00000")
            .columns.is-variable.is-1
              .column.is-3
                label Address
              .column
                b-field
                  b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country")
            .columns.is-variable.is-1
              .column.is-3
                label Referral ID
              .column
                b-field
                  b-input(type="text" placeholder="000-00000")
              .column
                b-field
                  b-input(type="text" placeholder="Referral Name")
            .columns.is-variable.is-1
              .column.is-3
                label Status
              .column
                b-field.cus-des-1
                  b-select(placeholder="Approved/Suspended" expanded)
                    option(value="approved") Approved
                    option(value="suspended") Suspended
            .columns.is-variable.is-1
              .column.is-3
              .column
                button.button.btn-des-1
                  b-icon(icon="plus-circle" style="margin-top: 2px;")
                  | &nbsp;&nbsp;&nbsp;&nbsp;Add Moderator
</template>

<script>
    export default {
        layout: 'admin_layout'
    }
</script>
