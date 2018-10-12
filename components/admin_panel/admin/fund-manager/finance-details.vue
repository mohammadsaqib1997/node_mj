<template lang="pug">
  .fd-admin
    wsAdmin
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Finance Details
      .body
        .section
          tblTopFilter(:act_view="String(load_params.limit)" :s_txt="load_params.search" @change_act_view="update_params('limit', parseInt($event))" @change_s_txt="update_params('search', $event)")
            
          b-field.total-count
            p.control.has-text-right
              span Total Balance:
              span.count {{ tot_balance }}/-

          tableComp(:arr="l_data" :loading="loading" :striped="true" :total_record="num_rows" :per_page="parseInt(load_params.limit)" :page_set="load_params.page" @page_change="update_params('page', $event)")
            template(slot="thead")
              tr
                th ID
                th Date
                th Description
                th Debit
                th Credit
                th Balance
            template(slot="tbody")
              tr(v-for="row in l_data")
                td {{ row.id }}
                td {{ $store.getters.formatDate(row.created_at) }}
                td {{ row.remarks }}
                td {{ row.debit }}
                td {{ row.credit }}
                td {{ row.balance }}
              tr
                th.has-text-right(colspan='5') Last Balance
                th {{ last_balance }}
</template>

<script>
import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import tableComp from "~/components/html_comp/tableComp.vue";
import wsAdmin from "~/components/admin_panel/admin/wallet-show.vue";
export default {
  mixins: [mxn_tableFilterListing],
  components: {
    tableComp,
    wsAdmin,
    tblTopFilter
  },
  data() {
    return {
      tot_balance: 0,
      last_balance: 0
    };
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/admin/trans_list", { params: self.load_params })
        .then(res => {
          self.num_rows = res.data.tot_rows;
          self.tot_balance = res.data.tot_balance;
          self.last_balance = res.data.last_balance;

          let gen_data = _.map(_.reverse(res.data.data), (o, key) => {
            let last_bln = !res.data.data[key - 1]
              ? res.data.last_balance
              : res.data.data[key - 1].balance;
            let item = o;
            item["balance"] = last_bln + (o.debit - o.credit);
            return o;
          });
          self.l_data = _.reverse(gen_data);
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    }
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

