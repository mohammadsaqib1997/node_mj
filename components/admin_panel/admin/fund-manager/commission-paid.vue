<template lang="pug">
    .a-commission-paid
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
                    table-comp(:arr="data" :loading="false" :striped="true")
                        template(slot="thead")
                            tr
                                th(width="50px")
                                th ID
                                th Email
                                th Name
                                th Status
                                th Paid Amount
                                th Receipt
                        template(slot="tbody")
                            tr(v-for="row in data")
                                td.ed-con(width="50")
                                    button.button.ed-btn
                                        b-icon(icon="edit")
                                        | &nbsp;&nbsp;&nbsp;EDIT
                                td {{ row.id }}
                                td {{ row.id }}
                                td {{ row.first_name }}
                                td {{ row.id }}
                                td {{ row.id }}
                                td.receipt_con
                                    template(v-if="row.receipt")
                                        a.anch(href="#") REF {{ "#"+row.receipt }}
                                    template(v-else)
                                        .upload
                                            span UPLOAD&nbsp;&nbsp;&nbsp;
                                            b-icon(icon="plus-circle")
</template>

<script>
import tableComp from "~/components/html_comp/tableComp.vue";
export default {
  components: {
    tableComp
  },
  layout: "admin_layout",
  data() {
    const data = [
      {
        id: 1,
        first_name: "Jesse",
        receipt: 123334
      },
      {
        id: 2,
        first_name: "John"
      },
      {
        id: 3,
        first_name: "Tina",
        receipt: 123334
      },
      {
        id: 4,
        first_name: "Clarence"
      },
      {
        id: 5,
        first_name: "Anne"
      }
    ];

    return {
      data
    };
  }
};
</script>
