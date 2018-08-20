<template lang="pug">
    .m-comission-paid
        walletShow
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
                        
                        b-field.total-count
                            p.control.has-text-right
                                span Total Paid Comission:
                                span.count 32,000
                                
                    table-comp(:arr="com_list" :loading="loading" :striped="true")
                        template(slot="thead")
                            tr
                                th ID
                                th Description
                                th Issue Date
                                th Amount
                        template(slot="tbody")
                            tr(v-for="row in com_list")
                                td {{ row.id }}
                                td {{ row.description }}
                                td {{ (row.status > 1) ? $store.getters.formatDate(row.date):((row.status == 0) ? 'Pending':'Process') }}
                                td {{ row.amount }}
</template>

<script>
import tableComp from "~/components/html_comp/tableComp.vue";
import walletShow from "~/components/admin_panel/member/wallet-show.vue";
export default {
  components: {
    tableComp,
    walletShow
  },
  layout: "admin_layout",
  computed: {
    com_list: function() {
      return this.$store.state.member.commissions.list;
    }
  },
  async mounted () {
      this.loading = true
      await this.$store.dispatch('member/commissions/loadCommissions')
      this.loading = false
  },
  data() {
    return {
        loading: true
    };
  }
};
</script>

