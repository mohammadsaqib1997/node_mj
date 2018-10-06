<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Commission Paid
      .body
        .section
          tblTopFilter(:act_view="String(params.limit)" :s_txt="params.search" @change_act_view="set_params({ param: 'limit', value: parseInt($event) })" @change_s_txt="set_params({ param: 'search', value: $event })")
          table-comp(:arr="ren_data" :loading="loading" :striped="true" :total_record="tot_rows" :per_page="parseInt(params.limit)" :page_set="params.page" @page_change="set_params({ param: 'page', value: $event })")
              template(slot="thead")
                tr
                  th ID
                  th Date
                  th Description
                  th Amount
                  th Receipt
              template(slot="tbody")
                  tr(v-for="row in ren_data")
                    td {{ row.id }}
                    td {{ $store.getters.formatDate(row.date) }}
                    td {{ row.description }}
                    td {{ row.amount }}
                    td.receipt_con
                      template(v-if="row.tot_rcp_up > 0")
                        .upload
                          span Total Receipts {{ row.tot_rcp_up }}&nbsp;&nbsp;&nbsp;
                          button.button.is-small.is-info(@click.prevent="rec_v_md=true;rv_ref_id=row.id;rv_mem_id=row.member_id")
                            | &nbsp;
                            b-icon(icon="eye" pack="far")
                            | &nbsp;

                      template(v-else)
                        .upload(v-if="hasFile(row.id)" @click.prevent="uploadFile(row.member_id, row.id, 1)")
                          span UPLOAD&nbsp;&nbsp;&nbsp;
                          b-icon(icon="upload")
                          b-icon.del(icon="times-circle" @click.prevent.stop.native="remFile(row.id)")
                        b-upload(v-else @input="fileChange({e: $event, id: row.id})")
                          span UPLOAD&nbsp;&nbsp;&nbsp;
                          b-icon(icon="plus-circle")
    receiptView(:md_act="rec_v_md" :ref_id="rv_ref_id" :mem_id="rv_mem_id" :type="1" @closed="afterRVClosed")
</template>

<script>
import _ from "lodash";
import tableComp from "~/components/html_comp/tableComp.vue";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import receiptView from "~/components/modals/receipt_view.vue";

import mxn_receiptUpload from "~/mixins/receipt_upload.js";

export default {
  mixins: [mxn_receiptUpload],
  layout: "admin_layout",
  components: {
    tableComp,
    tblTopFilter,
    receiptView
  },
  async mounted() {
    const self = this;
    self.loading = true;
    await self.loadData();
    self.loading = false;
  },
  data() {
    return {
      rec_v_md: false,
      rv_ref_id: null,
      rv_mem_id: null,
      ren_data: [],
      tot_rows: 1,
      loading: false,
      params: {
        limit: 10,
        page: 1,
        search: ""
      }
    };
  },
  methods: {
    loadData: async function() {
      const self = this;
      await self.$axios
        .get("/api/commission/paid", {
          params: self.params
        })
        .then(res => {
          self.ren_data = res.data.data;
          self.tot_rows = res.data.tot_rows;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async set_params(pld) {
      const self = this;
      let param_val = _.get(self.params, pld.param, null);
      if (param_val !== null && param_val !== pld.value) {
        if (pld.param !== "page") {
          _.set(self.params, "page", 1);
        }
        _.set(self.params, pld.param, pld.value);
        self.loading = true;
        self.after_settle(async function() {
          await self.loadData();
          self.loading = false;
        });
      }
    },
    after_settle: _.debounce(function(cb) {
      cb();
    }, 1000),

    async afterRVClosed(event) {
      this.rec_v_md = event;
      this.rv_ref_id = null;
      this.rv_mem_id = null;
      this.loading = true;
      await this.loadData();
      this.loading = false;
    }
  }
};
</script>
