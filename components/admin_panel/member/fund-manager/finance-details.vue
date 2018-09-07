<template lang="pug">
    .fd-member
        walletShow
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Finance Details
            .body
                .section
                    tblTopFilter(:act_view="String(params.limit)" :s_txt="params.search" @change_act_view="update_params({ param: 'limit', value: parseInt($event) })" @change_s_txt="update_params({ param: 'search', value: $event })")

                    b-field.total-count
                        p.control.has-text-right
                            span Total Transaction Balance:
                            span.count {{ $store.state.member.transactions.tot_balance }}/-
                    table-comp(:arr="trans_data" :loading="loading" :striped="true" :total_record="tot_rows" :per_page="parseInt(params.limit)" :page_set="params.page" @page_change="update_params({ param: 'page', value: $event })")
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
import { mapState, mapActions } from "vuex";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import tableComp from "~/components/html_comp/tableComp.vue";
import walletShow from "~/components/admin_panel/member/wallet-show.vue";
export default {
  components: {
    tableComp,
    walletShow,
    tblTopFilter
  },
  computed: {
    ...mapState({
      params: state => state.member.transactions.load_params,
      tot_rows: state => state.member.transactions.total_s_rows,
      loading: state => state.member.transactions.list_loader
    }),
    trans_data: function() {
      return this.$store.state.member.transactions.list;
    }
  },
  async mounted() {
    this.$store.commit("member/transactions/set_list_loader", true);
    await this.$store.dispatch("member/transactions/loadTransactions");
    this.$store.commit("member/transactions/set_list_loader", false);
  },
  data() {
    return {};
  },
  methods: {
      ...mapActions({
          update_params: 'member/transactions/update_params'
      })
  }
};
</script>

<style lang="scss" scoped>
.total-count {
  > p {
    font-size: 16px;
    font-weight: 500;
    color: #959595;
    > .count {
      margin-left: 5px;
      color: #666666;
    }
  }
}
</style>


