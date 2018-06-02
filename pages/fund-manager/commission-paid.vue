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
                    b-table.table-des-1(:data="data" :bordered="true" paginated :per-page="10")
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






    


</style>
