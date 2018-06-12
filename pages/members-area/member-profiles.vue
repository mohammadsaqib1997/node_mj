<template lang="pug">
    .wrapper
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Member Profiles
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
                                | {{ props.row.email }}
                            b-table-column(field="name" label="Name" )
                                | {{ props.row.name }}
                            b-table-column(field="status" label="Status" )
                                | {{ props.row.status }}
                            b-table-column(field="paid_amount" label="Due Amount" )
                                | Suspended
                        template(slot="bottom-left")
                            p.page-result-txt Showing 15 of  430 results
        br
</template>

<script>
    export default {
        layout: 'admin_layout',
        data () {
            const data = [
                { 'id': 1, 'name': 'Jesse', 'status': 'Active', 'email': 'abc@domain.com' },
                { 'id': 2, 'name': 'John', 'status': 'Inactive', 'email': 'abc@domain.com' },
                { 'id': 3, 'name': 'Tina', 'status': 'Inactive', 'email': 'abc@domain.com' },
                { 'id': 4, 'name': 'Clarence', 'status': 'Active', 'email': 'abc@domain.com' },
                { 'id': 5, 'name': 'Anne', 'status': 'Active', 'email': 'abc@domain.com' },
            ]

            return {
                data
            }
        }
    }
</script>

<style lang="sass" scoped>

</style>
