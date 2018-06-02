<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Commission UnPaid
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
                  b-table-column(field="paid_amount" label="Due Amount" )
                      | {{ props.row.id }}
                  b-table-column.receipt_con(field="receipt" label="Receipt")
                    template(v-if="props.row.receipt !== false")
                      a.anch(href="#") REF {{ "#"+props.row.receipt }}
                    template(v-else)
                      .upload
                        span UPLOAD&nbsp;&nbsp;&nbsp;
                        b-icon(icon="plus-circle")
              template(slot="bottom-left")
                  p.page-result-txt Showing 15 of  430 results
</template>

<script>
    export default {
        layout: 'admin_layout',
        data () {
            const data = [
              { 'id': 1, 'receipt': '12345' },
              { 'id': 2, 'receipt': false },
              { 'id': 3, 'receipt': '12345' },
              { 'id': 4, 'receipt': false },
              { 'id': 5, 'receipt': false },
            ]

            return {
                data
            }
        }
    }
</script>

<style scoped>

</style>
