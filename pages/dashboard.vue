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
        br

</template>

<script>
    export default {
        layout: 'admin_layout'
    }
</script>

<style scoped lang="sass">
    .wrapper
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
                            color: #d9bd68
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
                                color: #d9bd68
                                font-size: 26px
                            h1
                                margin: 0
                                color: #d9bd68
                                font-weight: 300
                                font-size: 2.2rem
                                line-height: 1.5rem

</style>