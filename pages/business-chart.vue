<template lang="pug">
    .wrapper
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Member Business Chart
                .column
                    .field
                        p.control.has-icons-right
                            input.input(type="search" placeholder="Search by Member ID or Name")
                            span.icon.is-right
                                i.fas.fa-search
            .body
                .section
                    .columns.is-gapless.sts_lvls
                        .column.is-narrow
                            h4 LEVEL:
                                span  4
                        .column
                            h4 TOTAL REFERRALS:
                                span  4
                        .column
                            h4 DIRECT REFERRALS:
                                span  4
                        .column
                            h4 IN-DIRECT REFERRALS:
                                span  4

                    .separator.lvl-head
                        h5 HEAD
                    .separator.lvl-0
                        h5 LEVEL 0
                    .separator.lvl-1
                        h5 LEVEL 1

                    ul.hierarchy_chart
                        .separator.mini
                            h5 HEAD
                        li
                            .box.profile-show
                                .of-hide
                                    .header
                                        b-icon(pack="fas" icon="user")
                                        p.name Ahmed
                                    .footer
                                        p.id 12345
                                        p.lvl LVL 1
                            ul
                                li(v-for="n1 in 4")
                                    .separator.mini
                                        h5 LEVEL 0
                                    .box.profile-show(:class="{ 'direct-ref': n1===2 }")
                                        .of-hide
                                            .header
                                                b-icon(pack="fas" icon="user")
                                                p.name Ahmed
                                            .footer
                                                p.id 12345
                                                p.lvl LVL 1
                                    ul
                                        .separator.mini
                                            h5 LEVEL 1
                                        li(v-for="n2 in 4")
                                            .box.profile-show.mini(:class="{ 'in-direct-ref' : ((n1 === 1 && n2 === 4) || (n1 > 2 && (n2%2) === 0)), 'direct-ref': (n1 === 2) }")
                                                .of-hide(v-on:click.prevent="activeProf")
                                                    .header
                                                        b-icon(pack="fas" icon="user")
                                                .dropup.box
                                                    h3 Sohail Haris
                                                    p ID: 10992
                                                    p LVL 3

</template>

<script>
    export default {
        layout: 'admin_layout',
        data() {
            return {
                curr_prof_active: null
            }
        },
        methods: {
            activeProf: function (e) {
                let target = e.target.closest(".profile-show.mini")
                if(this.curr_prof_active !== null && this.curr_prof_active !== target) {
                    this.curr_prof_active.classList.remove("active")
                }
                if(this.curr_prof_active !== target) {
                    this.curr_prof_active = target
                    target.classList.add("active")
                }else{
                    this.curr_prof_active.classList.remove("active")
                    this.curr_prof_active = null
                }

            }
        }
    }
</script>

<style scoped lang="sass">

    .hierarchy_chart
        list-style: none
        margin: 0
        ul
            list-style: none
            margin: 0
            display: flex
            align-items: center
            position: relative
            &:before
                content: ' '
                position: absolute
                bottom: calc(100% + 2rem)
                background-color: #afafaf
                height: 2px
                left: 12%
                right: 12%
            & > li
                position: relative
                margin: 0 auto
                &:before
                    content: ' '
                    position: absolute
                    width: 2px
                    height: 2rem
                    background-color: #afafaf
                    bottom: 100%
                    left: calc(50% - 1px)
                ul
                    list-style: none
                    margin: 0
                    position: relative
                    &:before
                        content: ' '
                        position: absolute
                        bottom: calc(100% + 2rem)
                        background-color: #afafaf
                        height: 2px
                        width: auto
                        left: 26px
                        right: 26px
                    & > li
                        margin-left: .25rem
                        margin-right: .25rem
                        position: relative
                        &:before
                            content: ' '
                            position: absolute
                            width: 2px
                            height: 2rem
                            background-color: #afafaf
                            bottom: 100%
                            left: calc(50% - 1px)
        @media screen and (max-width: 1359px)
            ul
                display: block
                margin-left: 3rem
                &:before
                    top: -2rem
                    bottom: 22.7rem
                    height: auto
                    width: 2px
                    left: -2rem
                & > li
                    &:before
                        top: 3rem
                        right: 100%
                        left: auto
                        width: 2rem
                        height: 2px
                    ul
                        margin-left: 3rem
                        margin-bottom: 2rem
                        &:before
                            top: -2rem
                            bottom: 1.65rem
                            height: auto
                            width: 2px
                            left: -2rem
                        & > li
                            &:before
                                top: calc(50% - 2px)
                                right: 100%
                                left: auto
                                width: 2.2rem
                                height: 2px


    .profile-show
        text-align: center
        padding: 0
        border: 2px solid #afafaf
        margin: 0 auto 5rem
        width: 7rem
        text-transform: uppercase
        font-weight: 500
        letter-spacing: -0.7px
        position: relative
        cursor: pointer
        &:after
            content: ' '
            position: absolute
            height: 3rem
            width: 2px
            top: calc(100% + 2px)
            background-color: #afafaf
        &.mini
            display: inline-block
            width: auto
            margin: 0 auto
            &:after
                content: none
            & > .dropup
                display: none
                position: absolute
                min-width: 8rem
                max-width: 12rem
                margin-top: 1rem
                margin-left: -110%
                z-index: 1
                &:before
                    content: ' '
                    position: absolute
                    top: -11px
                    left: calc(50% - 10px)
                    background-color: white
                    width: 20px
                    height: 20px
                    border-top: 1px solid rgba(10, 10, 10, 0.1)
                    border-left: 1px solid rgba(10, 10, 10, 0.1)
                    -webkit-transform: rotate(45deg)
                    -moz-transform: rotate(45deg)
                    -ms-transform: rotate(45deg)
                    -o-transform: rotate(45deg)
                    transform: rotate(45deg)
                h3
                    font-size: 15px
                    font-weight: 500
                    white-space: nowrap
                    color: #454545
                p
                    font-size: 14px
                    margin-bottom: 2px
                    color: #838383
            &.active
                & > .dropup
                    display: block
        .of-hide
            overflow: hidden
            border-radius: 3px
            .header
                color: #3f405b
                padding: .6rem
            .footer
                background-color: #3d3e5a
                padding: .6rem
                p
                    margin-bottom: 0
                    color: #ffffff
                    &.lvl
                        color: #8c8db4

        &.direct-ref
            border-color: #db3279
            .of-hide
                .header
                    background-color: #3d3e5a
                    color: #fff
                    .icon
                        color: #db3279
        &.in-direct-ref
            border-color: #db3279
            .of-hide
                .header
                    background-color: #f1e8cc
        @media screen and (max-width: 1359px)
            margin: 0 0 2rem
            &:after
                content: none

    .sts_lvls
        margin-bottom: 6rem !important
        & > .column
            padding-right: 1.5rem !important
            &.is-narrow
                padding-right: 5rem !important
                @media screen and (max-width: 768px)
                    padding-right: 0 !important
            &:last-child
                padding-right: 0 !important
            h4
                margin-bottom: 0
                span
                    color: #969595
            @media screen and (max-width: 768px)
                padding-right: 0 !important
                margin-bottom: 1rem
        @media screen and (max-width: 768px)
            margin-bottom: 2rem


    .separator
        border-bottom: 2px dotted #efefef
        position: absolute
        width: calc(100% - 4rem)
        top: 0
        &.lvl-head
            top: 7rem
        &.lvl-0
            top: 20.2rem
        &.lvl-1
            top: 33rem
        h5
            font-size: 12px
            margin-bottom: 0
            color: #c2c2c2
        &.mini
            display: none
        @media screen and (max-width: 1359px)
            display: none
            &.mini
                display: block
                width: 100%
                position: relative
                margin-bottom: 1rem
            &.lvl-head, &.lvl-0, &.lvl-1
                top: auto



</style>