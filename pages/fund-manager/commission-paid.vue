<template lang="pug">
    .wrapper
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Commission Paid
            .body
                .section
                    b-field.table-filter(grouped)
                        b-field.sort-fields
                            p.control
                                button.button
                                    b-icon(icon="sort-amount-down" pack="fas")
                            p.control
                                button.button
                                    b-icon(icon="sort-amount-up" pack="fas")
                            b-select(placeholder="By Field")
                                option(value="email") By Email
                                option(value="name") By Name
                                option(value="id") By ID
                        b-field.search-field(expanded)
                            p.control.has-icons-right
                                input.input(type="search" placeholder="Search")
                                span.icon.is-right
                                    i.fas.fa-search
                        b-field.view-field
                            p.control
                                button.button
                                    b-icon(icon="eye" pack="fas")
                                    | &nbsp;&nbsp;&nbsp;VIEW
                    b-table.list-table(:data="data" :bordered="true" paginated :per-page="10")
                        template(slot-scope="props")
                            b-table-column.ed-con(width="50")
                                button.button.ed-btn
                                    b-icon(icon="edit")
                                    | &nbsp;&nbsp;&nbsp;EDIT
                            b-table-column(field="id" label="ID" width="40" centered)
                                | {{ props.row.id }}
                            b-table-column(field="email" label="Email" )
                                | {{ props.row.first_name }}
                            b-table-column(field="name" label="Name" )
                                | {{ props.row.id }}
                            b-table-column(field="status" label="Status" )
                                | {{ props.row.id }}
                            b-table-column(field="paid_amount" label="Paid Amount" )
                                | {{ props.row.id }}
                            b-table-column(field="receipt" label="Receipt" )
                                | {{ props.row.id }}
                        template(slot="bottom-left")
                            p.page-result-txt Showing 15 of  430 results
        br
</template>

<script>
    export default {
        layout: 'admin_layout',
        data () {
            const data = [
                { 'id': 1, 'first_name': 'Jesse', 'last_name': 'Simmons', 'date': '2016/10/15 13:43:27', 'gender': 'Male' },
                { 'id': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016/12/15 06:00:53', 'gender': 'Male' },
                { 'id': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016/04/26 06:26:28', 'gender': 'Female' },
                { 'id': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016/04/10 10:28:46', 'gender': 'Male' },
                { 'id': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016/12/06 14:38:38', 'gender': 'Female' },
            ]

            return {
                data
            }
        }
    }
</script>

<style lang="sass">
    .ed-btn
        color: #666666
        border: none
        height: 4rem
        width: 6.5rem
        font-weight: 500
        -webkit-border-radius: 0
        -moz-border-radius: 0
        border-radius: 0
        &:focus, &:active
            -webkit-box-shadow: 0 0 0 0.12em #bbbbbb !important
            -moz-box-shadow: 0 0 0 0.12em #bbbbbb !important
            box-shadow: 0 0 0 0.12em #bbbbbb !important
        &>.icon
            color: #d9bd68

    .table-filter
        align-items: center
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
                        color: #d9bd68
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
                        -webkit-box-shadow: 0 0 0 0.12em #d9bd68 !important
                        -moz-box-shadow: 0 0 0 0.12em #d9bd68 !important
                        box-shadow: 0 0 0 0.12em #d9bd68 !important
                    &>.icon
                        margin-top: 2px
                        color: #d9bd68
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



    .list-table
        &>.table-wrapper
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
        .pagination
            a
                &[role=button]
                    -webkit-border-radius: 0
                    -moz-border-radius: 0
                    border-radius: 0
                    border-color: #eeeeee
                    color: #959595
                    &.is-current
                        background-color: #d9bd68
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


</style>
