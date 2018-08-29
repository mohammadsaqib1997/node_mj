<template lang="pug">
    .wrapper
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Notifications
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
                                    b-icon(icon="times-circle" pack="fas")
                                    | &nbsp;&nbsp;&nbsp;DELETE

                    
                    //- b-table.table-des-1(:data="ren_data" :bordered="true" paginated :per-page="10")
                    //-     template(slot-scope="props")
                    //-       b-table-column.sts-con(width="50" label="MARK READ/ UNREAD" :class="{ active: (!props.row.read_status) }")
                    //-         button.button.r-sts-btn
                    //-           span
                    //-             | {{ (props.row.read_status) ? "READ" : "UNREAD" }}
                    //-       b-table-column(label="From" :class="{ active: (!props.row.read_status) }")
                    //-           | {{ props.row.email }}
                    //-       b-table-column(label="Message" :class="{ active: (!props.row.read_status) }")
                    //-           | Pending members list needs to be updated ...
                    //-       b-table-column(label="Date" :class="{ active: (!props.row.read_status) }")
                    //-           | 16-4-2018
                    //-     template(slot="bottom-left")
                    //-         p.page-result-txt Showing 15 of  430 results
        br
</template>

<script>
export default {
  layout: "admin_layout",
  data() {
    return {
      ren_data: []
    };
  }
};
</script>

<style lang="sass" scoped>
  .table-des-1
    & /deep/
      table
        thead
          tr
            th
              padding: .7rem
              color: #454545
              vertical-align: middle
        tbody
          tr
            td
              &.sts-con
                padding: 0 !important
                span
                  display: block
                  .r-sts-btn
                    width: 100%
                    height: 4rem
                    padding: 0
                    border-radius: 0
                    border: 0
                    background-color: transparent
                    span
                      position: relative
                      font-weight: 600
                      color: #666666
                      font-size: 14px
                      &:after
                        content: " "
                        position: absolute
                        width: 100%
                        height: 1px
                        background-color: #dfdfdf
                        left: 0
                        top: 100%

                    &:hover, &:focus
                      -webkit-box-shadow: 0 0 0 0.125em rgba(218, 189, 103, 0.7)
                      box-shadow: 0 0 0 0.125em rgba(218, 189, 103, 0.7)
              &.active
                background-color: #f6f6f6



</style>
