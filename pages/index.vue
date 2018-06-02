<template lang="pug">
    section.section
        .container.main
            .columns
                .column.is-4
                    h1.title Sign Up
                    p Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    ul.status_items
                        li.item.complete
                            b Step 1:&nbsp;
                            | User Details
                        li.item.complete
                            b Step 2:&nbsp;
                            | Product Details
                        li.item
                            b Step 3:&nbsp;
                            | Activation
                        li.item
                            b Step 4:&nbsp;
                            | Confirmation
                .column.is-6.is-offset-1
                    .tab-des-1
                        .tab-header
                            .columns.is-gapless
                                .column(@click="tabActive(0)")
                                    .t-card(:class="{active: (tab_header_ind === 0)}")
                                        span Supreme Card
                                .column(@click="tabActive(1)")
                                    .t-bike(:class="{active: (tab_header_ind === 1)}")
                                        span Motorcycle
                        .tab-body
                            .tab-content.active
                                section.form
                                    b-field(label="Full Name")
                                        b-input(type="text" placeholder="(example: Shabir Ahmed)")

                                    b-field(label="Password")
                                        b-input(type="password" placeholder="******")

                                    b-field(label="Email")
                                        b-input(type="email" placeholder="(example: shabir@gmail.com)")

                                    b-field(label="CNIC")
                                        b-input(type="text" placeholder="xxxxx-xxxxxxx-x")

                                    b-field(label="Contact Number")
                                        b-input(type="text" placeholder="+92-xxx-xxx-xxxx")

                                    b-field(label="Number Of Bikes" v-if="(tab_header_ind === 1)")
                                        b-input(type="number" placeholder="Quantity No.#")

                                    b-field(label="Address")
                                        b-input(type="text" placeholder="House No. #, Street Name, Area, City, Province, Country")

                                    b-field(label="Referral Code")
                                        b-input(type="text" placeholder="Enter member ID")

                                    b-field.has-text-centered.my-2
                                        button.button.btn-des-1
                                            | Continue to step 2&nbsp;&nbsp;
                                            b-icon(icon="angle-right" style="margin-top: 2px;")



</template>

<script>
    export default {
        data() {
            return {
                form: {
                    suc: '',
                    err: '',
                    loading: false
                },
                tab_header_ind: 0,
                email: '',
                password: '',
                remember_me: true
            }
        },
        methods: {
            tabActive: function (ind) {
                this.tab_header_ind = ind
            }
        }
    }
</script>

<style scoped lang="sass">
    .main
        color: #393e50

        h1.title
            color: #393e50
            font-size: 3rem
            font-family: serif
            font-weight: 100
            text-transform: uppercase
            padding-bottom: 1.5rem
            position: relative
            &:after
                position: absolute
                content: ' '
                background-color: #d9bd68
                height: 4px
                width: 50px
                bottom: 0
                left: 0
        .status_items
            margin-top: 2rem
            text-transform: uppercase
            font-size: 15px
            color: #828384
            .item
                position: relative
                padding-left: 35px
                padding-bottom: 50px
                &:first-child
                    &:before
                        content: none
                &:before
                    content: ' '
                    position: absolute
                    width: 1px
                    height: 100%
                    background-color: #dddfe0
                    left: 4.5px
                    bottom: calc(100% - 16px)
                &:after
                    content: ' '
                    position: absolute
                    width: 10px
                    height: 10px
                    background-color: #dddfe0
                    left: 0
                    top: 6px
                    border-radius: 100%

                &.complete
                    color: #2d2e30
                    &:after, &:before
                        background-color: #f3257f
        .tab-des-1
            min-height: 100%
            background-color: #feffff
            border-radius: 5px
            position: relative
            box-shadow: 0 1px 15px #ccc
            .tab-header
                text-align: center
                text-transform: uppercase
                color: #9197b8
                background-color: #3b3f58
                border-radius: 5px 5px 0 0
                .t-card, .t-bike
                    position: relative
                    padding: 35px
                    font-size: 14px
                    font-weight: bold
                    cursor: pointer
                    border-bottom: 2px solid #9197b8
                    &.active
                        border-bottom: 2px solid #d9bd68
                        color: #fff
                    &:before
                        content: ' '
                        display: block
                        width: 100%
                        height: 50px
                        background-repeat: no-repeat
                        background-position: center
                        background-size: contain
                        margin-bottom: 12px
                .t-card
                    &.active
                        &:before
                            background-image: url("~/assets/img/credit-card-active.png")
                    &:before
                        background-image: url("~/assets/img/credit-card.png")
                .t-bike
                    &.active
                        &:before
                            background-image: url("~/assets/img/motorcycle-active.png")
                    &:before
                        background-image: url("~/assets/img/motorcycle.png")
            .tab-body
                .tab-content
                    display: none
                    padding: 25px
                    &.active
                        display: block
</style>