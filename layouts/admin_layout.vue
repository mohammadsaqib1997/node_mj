<template lang="pug">
    .admin-layout
        template(v-if="$store.state.pageLoading === false && $store.state.user !== null")
            top-bar
            side-nav
            .main-content
                nuxt
            footer-comp
</template>

<script>
import sideNavComp from "~/components/admin_panel/sidenav.vue";
import topBarComp from "~/components/admin_panel/topbar.vue";
import footerComp from "~/components/admin_panel/footer.vue";
export default {
  components: {
    "side-nav": sideNavComp,
    "top-bar": topBarComp,
    "footer-comp": footerComp
  },
  computed: {
    user: function() {
      return this.$store.state.user;
    }
  },
  watch: {
    user: function(val) {
      if (val === null) {
        this.$router.push("/");
      }
    }
  }
};
</script>

<style lang="sass" scoped>
    $primary: #d9bd68
    $primary-light: rgba(217, 189, 104, 0.25)

    .admin-layout
        background-color: #f6f6f6

        & /deep/
            .wrapper
                padding-bottom: 5rem
            .main-box
                padding: 0
                & > .header
                    padding: 1rem 2rem 1rem 2.5rem
                    border-bottom: 3px solid #dcdcdc
                    position: relative
                    align-items: center
                    margin-bottom: 0
                    h1
                        margin-bottom: 0
                        margin-right: auto
                        font-family: serif
                        font-size: 2rem
                        color: #454545
                        text-transform: uppercase
                    .field
                        max-width: 22rem
                        margin-left: auto
                        .control
                            .input
                                border-radius: 0
                                box-shadow: none
                                border: 1px solid #eeeeee
                                height: 2.8rem
                                @media screen and (max-width: 425px)
                                    font-size: 3vw
                            .icon
                                top: 4px
                                color: $primary
                            &.is-loading
                                .icon
                                    display: none
                                &:after
                                    top: 14px
                    @media screen and (max-width: 768px)
                        padding: 1rem 2rem
                        h1
                            margin-bottom: .5rem
                        .field
                            max-width: 100%

                    &:after
                        content: ' '
                        position: absolute
                        width: 5rem
                        height: 3px
                        background-color: $primary
                        left: 0
                        top: 100%
                .body
                    .section
                        position: relative
                        padding: 2rem

            .main-content
                width: calc(100% - 250px)
                height: calc(100vh - 100px)
                position: relative
                margin-left: 250px
                overflow-y: auto
                padding-left: 4rem
                padding-right: 5rem
                padding-top: 2rem
                padding-bottom: 2rem
                margin-bottom: 0
                @media screen and (max-width: 1023px)
                    width: 100%
                    margin-left: 0
                    padding-left: 1rem
                    padding-right: 1rem

            .modal-des-1
                .modal-card
                    border-radius: 5px
                    border: 1px solid $primary
                    .modal-card-body
                        padding: inherit

            .exp-btn
                height: auto
                border: none
                box-shadow: none !important
                text-transform: uppercase

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
                        &:focus, &:active
                            border-color: $primary

            .table-filter
                align-items: center
                margin-bottom: 2rem !important
                &>.field
                    margin-bottom: 0
                    &.sort-fields
                        &>.control
                            &>.button, &>.select
                                height: 2.8rem
                                border-color: #eeeeee
                                color: #afafaf
                            &>.button
                                width: 3rem
                                &:focus, &.active
                                    -webkit-box-shadow: inset 1px 2px 1px 0.5px #dcdcdc
                                    -moz-box-shadow: inset 1px 2px 1px 0.5px #dcdcdc
                                    box-shadow: inset 1px 2px 1px 0.5px #dcdcdc
                                    background-color: #e6e6e6
                            &>.select
                                &:after
                                    border-color: #afafaf
                                &>select
                                    border-color: #eeeeee
                                    height: 2.8rem
                                    &:focus, &:active
                                        -webkit-box-shadow: none
                                        -moz-box-shadow: none
                                        box-shadow: none
                    &.search-field
                        max-width: 22rem
                        margin-left: auto !important
                        margin-right: auto
                        .control
                            .input
                                border-radius: 0
                                box-shadow: none
                                border: 1px solid #eeeeee
                                height: 2.8rem
                                @media screen and (max-width: 425px)
                                    font-size: 3vw
                            .icon
                                top: 4px
                                color: $primary
                            &.is-loading
                                .icon
                                    display: none
                                &:after
                                    top: 14px
                    &.view-field
                        .button
                            color: #666666
                            border: none
                            height: 2rem
                            font-weight: 500
                            -webkit-border-radius: 0
                            -moz-border-radius: 0
                            border-radius: 0
                            font-size: 14px
                            &:focus, &:active
                                -webkit-box-shadow: 0 0 0 0.12em $primary !important
                                -moz-box-shadow: 0 0 0 0.12em $primary !important
                                box-shadow: 0 0 0 0.12em $primary !important
                            &>.icon
                                margin-top: 2px
                                color: $primary
                @media screen and (max-width: 768px)
                    display: block !important
                    &>.field
                        margin-bottom: 1rem
                        margin-left: 0 !important
                        justify-content: center
                        &>.control
                            text-align: center
                        &:last-child
                            margin-bottom: 0

            .box
                &.counter-box
                    background-color: #3d3e5a
                    padding: 0
                    text-align: center
                    .columns
                        .column
                            padding-top: 2rem !important
                            padding-bottom: 2rem !important
                            border-right: 2px solid #7c7d9e
                            &:last-child
                                border-right: none
                            @media screen and (min-width: 1024px) and (max-width: 1215px)
                                &:nth-child(2)
                                    border-right: none
                                &:nth-child(1), &:nth-child(2)
                                    border-bottom: 2px solid #7c7d9e
                            @media screen and (max-width: 1023px)
                                border-right: none
                                border-bottom: 2px solid #7c7d9e
                                &:last-child
                                    border-bottom: none
                            @media screen and (min-width: 769px) and (max-width: 1023px)
                                &:nth-child(1), &:nth-child(3)
                                    border-right: 2px solid #7c7d9e
                                &:nth-child(3)
                                    border-bottom: none
                                &:nth-child(1), &:nth-child(2)
                                    border-bottom: 2px solid #7c7d9e
                            &>h1
                                color: $primary
                                margin-bottom: 0
                                font-size: 4.5rem
                                font-weight: 200
                                line-height: 4.5rem
                            &>h5
                                color: #ffffff
                                text-transform: uppercase
                                font-size: 0.9rem
                                font-weight: bold
                                margin-bottom: 0
                                margin-top: 1rem
                            .amount-wrapepr
                                text-align: left
                                margin: 0 auto
                                display: inline-block
                                b
                                    color: $primary
                                    font-size: 26px
                                h1
                                    margin: 0
                                    color: $primary
                                    font-weight: 300
                                    font-size: 2.2rem
                                    line-height: 1.5rem

            .table-des-1
                &>table
                    color: #666666
                    thead
                        th
                            text-transform: uppercase
                            padding: 1rem
                            border-color: #eeeeee
                    tbody
                        td
                            padding: 1rem
                            vertical-align: middle
                            border-color: #eeeeee
                            &.ed-con
                                padding: 0
                                .ed-btn
                                    color: #666666
                                    border: none
                                    height: 4rem
                                    width: 6.5rem
                                    font-weight: 500
                                    -webkit-border-radius: 0
                                    -moz-border-radius: 0
                                    border-radius: 0
                                    &:focus, &:hover
                                        -webkit-box-shadow: 0 0 0 0.12em inset #bbbbbb !important
                                        -moz-box-shadow: 0 0 0 0.12em inset #bbbbbb !important
                                        box-shadow: 0 0 0 0.12em inset #bbbbbb !important
                                    &>.icon
                                        color: $primary
                            &.receipt_con
                                padding: 0
                                .anch
                                    margin-left: 1rem
                                    margin-right: 1rem
                                .upload
                                    cursor: pointer
                                    width: 100%
                                    height: 4rem
                                    text-align: left
                                    display: flex
                                    padding-left: 1rem
                                    padding-right: 1rem
                                    align-items: center
                                    &:hover
                                        -webkit-box-shadow: 0 0 0 0.12em inset #bbbbbb !important
                                        -moz-box-shadow: 0 0 0 0.12em inset #bbbbbb !important
                                        box-shadow: 0 0 0 0.12em inset #bbbbbb !important
                                    &>.icon
                                        color: $primary
                                    &>.del
                                        position: absolute
                                        right: 8px
                                        color: #ff3860
                .pagination
                    a
                        &[role=button]
                            -webkit-border-radius: 0
                            -moz-border-radius: 0
                            border-radius: 0
                            border-color: #eeeeee
                            color: #959595
                            &.is-current
                                background-color: $primary
                                color: #ffffff
                    @media screen and (min-width: 769px)
                        .pagination-previous
                            -webkit-box-ordinal-group: 2
                            -ms-flex-order: 1
                            order: 1
                        .pagination-next
                            -webkit-box-ordinal-group: 4
                            -ms-flex-order: 3
                            order: 3
                        .pagination-list
                            -webkit-box-ordinal-group: 3
                            -ms-flex-order: 2
                            order: 2
                .page-result-txt
                    font-size: 14px
                    color: #757575
                .em-sec
                  border: 1px solid #dbdbdb

            
            .btn-des-1
                color: #ffffff !important
                margin-top: 1rem
                background-color: #ea2378
                border-radius: 0
                border: none
                padding: 1rem 2rem
                min-height: 3.6rem
                height: auto
                text-transform: uppercase
                font-weight: bold
                font-size: 14px
                position: relative
                -webkit-box-shadow: 0 2px 20px 2px #ccc
                -moz-box-shadow: 0 2px 20px 2px #ccc
                box-shadow: 0 2px 20px 2px #ccc
                &:hover
                    background-color: #c52566
                &:focus
                    -webkit-box-shadow: 0 2px 20px 2px #ccc !important
                    -moz-box-shadow: 0 2px 20px 2px #ccc !important
                    box-shadow: 0 2px 20px 2px #ccc !important
                &:not(.is-loading):after
                    content: ' '
                    position: absolute
                    width: 100%
                    height: 5px
                    background-color: #c52566
                    bottom: 0

            .form
                label
                    font-weight: 300
                    line-height: 3rem
                    font-size: 1.3rem
                .field
                    position: relative
                .field:not(:last-child)
                    margin-bottom: 1.5rem

                .control.is-loading::after
                    top: 18px
                input.input, .cus-des-1 .select > select
                    background-color: #f5f6f7
                    -webkit-box-shadow: none
                    -moz-box-shadow: none
                    box-shadow: none
                    -webkit-border-radius: 0
                    -moz-border-radius: 0
                    border-radius: 0
                    border: 1px solid transparent;
                    font-size: 15px
                    color: #3b3f57
                    height: 3.2rem
                    padding: 0 1rem
                    &:focus, &:active
                        border-color: transparent
                        -webkit-box-shadow: 0 0 2px 0 $primary
                        -moz-box-shadow: 0 0 2px 0 $primary
                        box-shadow: 0 0 2px 0 $primary
                        background-color: #ffffff
                    &.is-danger
                        border: 1px solid #ff3860 !important;
                        &:focus, &:active
                            -webkit-box-shadow: 0 0 2px 0 #ff3860
                            -moz-box-shadow: 0 0 2px 0 #ff3860
                            box-shadow: 0 0 2px 0 #ff3860
                            background-color: #ffffff
                .select:not(.is-multiple)
                    height: auto
                .cus-des-1 .select:not(.is-multiple):not(.is-loading)::after
                    top: calc(0.625em + 1rem)
                    border-color: #dcdcdc

                .control.has-icons-right .icon.is-right
                    top: 6px

                .b-radio.radio
                    font-size: inherit
                    input[type=radio] + .check
                        border-color: $primary
                        &:before
                            background: $primary
                        &:hover
                            input[type=radio] + .check
                                border-color: $primary
                .error, .success
                    font-size: 22px
                    text-align: center
                    margin-bottom: 2rem
                    font-weight: 400
                .error
                    color: hsl(348, 100%, 61%)
                .success
                    color: hsl(141, 71%, 48%)

</style>
