<template lang="pug">
  .wrapper.profile
    .box.main-box
      .header.columns.is-gapless.is-multiline
        .column
          h1 Profile
        .column.is-2-desktop.is-12-tablet.has-text-right
          button.button.edit-btn
              b-icon(icon="edit")
              | &nbsp;&nbsp;&nbsp;&nbsp;Edit
      .body
        .section
          .columns.is-gapless
            .column.is-5
              .profile-img
                img(src="~/assets/img/default.png")
              .add-img-con
                img(src="~/assets/img/plus-icon.png")
                span Upload image
            .column
              .profile-info-con
                .columns.is-variable.is-1
                  .column
                    label ID
                  .column
                    h2 992233

                .columns.is-variable.is-1
                  .column
                    label Full Name
                  .column
                    h2 Zain Haider

                .columns.is-variable.is-1
                  .column
                    label Date Of Birth
                  .column
                    h2 26 Feb 1985

                .columns.is-variable.is-1
                  .column
                    label CNIC
                  .column
                    h2 000-0000-000-0

                .columns.is-variable.is-1
                  .column
                    label Email
                  .column
                    h2 user@domain.com

                .columns.is-variable.is-1
                  .column
                    label Contact Number
                  .column
                    h2 +92-123-12312

                .columns.is-variable.is-1
                  .column
                    label Address
                  .column
                    h2 House No. #, Street Name, Area, City, Province, Country

                .columns.is-variable.is-1
                  .column
                    label Referral ID
                  .column
                    h2 321212

                .columns.is-variable.is-1
                  .column
                    label Level
                  .column
                    h2 3

                .columns.is-variable.is-1
                  .column
                    label Status
                  .column
                    h2 Approved

                .columns.is-variable.is-1
                  .column
                    button.button.btn-des-1
                      img(src="~/assets/img/btn-coin.png")
                      | &nbsp;&nbsp;&nbsp;&nbsp;View Finances
</template>

<script>
    export default {
        layout: 'admin_layout'
    }
</script>

<style scoped lang="sass">
  .profile /deep/

    .profile-img
      margin-right: 5rem
      max-width: 20rem
      &>img
        width: 100%
    .add-img-con
      display: flex
      align-items: center
      &>span
        text-transform: uppercase
        font-size: 14px
        text-decoration: underline
        line-height: 2rem
        color: #838383
        padding: 0 5px
        cursor: pointer


    .edit-btn
      color: #666666
      border: none
      box-shadow: none !important
      font-weight: 500
      text-transform: uppercase
      .icon
        color: #d9bd68

    .btn-des-1
      &>img
        width: 20px

    .profile-info-con h2
      font-weight: bold
      line-height: 3rem
      font-size: 1.2rem
      color: #3d3e5a

    label
      font-weight: 300
      line-height: 3rem
      font-size: 1.2rem
</style>
