<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless">
        <div class="column">
          <h1>Invoices</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <table-comp :arr="ren_data" :loading="loading" :striped="true" :total_record="tot_rows" :per_page="parseInt(params.limit)"
            :page_set="params.page" @page_change="set_params({ param: 'page', value: $event })">
            <template slot="thead">
              <tr>
                <th width="50px">ID</th>
                <th width="200px">Type</th>
                <th width="200px">Date</th>
                <th>Reference File Name</th>
                <th width="50px">Action</th>
              </tr>
            </template>
            <template slot="tbody">
              <tr v-for="(row, ind) in ren_data" :key="ind">
                <td>{{ (row.type === 1) ? row.id : '' }}</td>
                <td>{{ (row.type === 1) ? 'Commission Invoice' : 'Activation Invoice' }}</td>
                <td>{{ dateFormat(row.date) }}</td>
                <td>{{ row.file_name }}</td>
                <td class="has-text-centered">
                  <button class="button is-small is-info" @click.prevent="download(row.file_id, row.file_name, row.type)">
                    <b-icon icon="download"></b-icon>
                  </button>
                </td>
              </tr>
            </template>
          </table-comp>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import tableComp from "~/components/html_comp/tableComp.vue";
import mxn_receiptUpload from "~/mixins/receipt_upload.js";
export default {
  mixins: [mxn_receiptUpload],
  layout: "admin_layout",
  components: {
    tableComp
  },
  async mounted() {
    const self = this;
    self.loading = true;
    await self.loadInvoice();
    self.loading = false;
  },
  data() {
    return {
      loading: false,
      ren_data: [],
      tot_rows: 1,
      params: {
        limit: 10,
        page: 1
      }
    };
  },
  methods: {
    dateFormat(str) {
      return moment(new Date(str)).format("DD-MM-YYYY hh:mm:ss");
    },
    async loadInvoice() {
      const self = this;
      await self.$axios
        .get("/api/receipt/get_invoices", {
          params: self.params
        })
        .then(res => {
          self.tot_rows = res.data.tot_rows;
          self.ren_data = res.data.result;
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
          await self.loadInvoice();
          self.loading = false;
        });
      }
    },
    after_settle: _.debounce(function(cb) {
      cb();
    }, 1000)
  }
};
</script>