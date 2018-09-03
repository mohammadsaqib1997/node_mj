<template lang="pug">
    .fd-member
        walletShow
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Finance Details
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
                                span Total Transaction Balance:
                                span.count {{ $store.state.member.transactions.balance }}/-
                                
                    tableComp(:arr="trans_data" :loading="loading" :striped="true" :paginate="false")
                        template(slot="thead")
                            tr
                                th ID
                                th Date
                                th Description
                                th Debit
                                th Credit
                        template(slot="tbody")
                            tr(v-for="row in trans_data")
                                td {{ row.id }}
                                td {{ $store.getters.formatDate(row.date) }}
                                td {{ row.description }}
                                td {{ row.debit }}
                                td {{ row.credit }}
</template>

<script>
import tableComp from "~/components/html_comp/tableComp.vue";
import walletShow from "~/components/admin_panel/member/wallet-show.vue";
export default {
  components: {
    tableComp,
    walletShow
  },
  computed: {
    trans_data: function () {
      return this.$store.state.member.transactions.list
    }
  },
  async mounted () {
      this.loading = true
      await this.$store.dispatch('member/transactions/loadTransactions');
      this.loading = false
  },
  data() {
    return {
        loading: true
    };
  }
};
</script>

