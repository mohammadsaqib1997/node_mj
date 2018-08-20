<template lang="pug">
    .fund-details
        walletShow
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Fund Details
            .body
                .section
                    .columns.is-gapless
                        .column.is-8
                            bankDetComp
                    hr
                    h2.title Recent Transactions
                    tableComp(:arr="trans_data" :loading="false" :striped="true" :paginate="false")
                        template(slot="thead")
                            tr
                                th ID
                                th Date
                                th Description
                                th Details
                        template(slot="tbody")
                            tr(v-for="row in trans_data")
                                td {{ row.id }}
                                td {{ $store.getters.formatDate(row.date) }}
                                td {{ row.description }}
                                td {{ row.detail }}
</template>

<script>
import tableComp from "~/components/html_comp/tableComp.vue";
import walletShow from "~/components/admin_panel/member/wallet-show.vue";
import bankDetComp from '~/components/admin_panel/member/bank-detail-sec.vue'
import moment from "moment";
import _ from "lodash";
export default {
  layout: "admin_layout",
  components: {
    walletShow,
    tableComp,
    bankDetComp
  },
  computed: {
    trans_data: function () {
      return this.$store.state.member.transactions.list
    }
  },
  async mounted() {
    this.loading = true;
    await this.$store.dispatch('member/transactions/loadTransactions');
    this.loading = false;
  },
  data() {
    return {
      loading: true,
    };
  },
  methods: {
    // trans_load: async function() {
    //   const result = await this.$axios.$get(
    //     "/api/transaction/" + this.$store.state.user.data.user_id
    //   );
    //   this.trans_data = result.data;
    // },

    fDate: function(str) {
      return moment(str).format("DD-MM-YYYY");
    }
  }
};
</script>

<style lang="sass" scoped>
</style>
