<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Commission UnPaid
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
                th Action
                th Receipt
            template(slot="tbody")
              tr(v-for="row in ren_data")
                td {{ row.id }}
                td {{ $store.getters.formatDate(row.date) }}
                td {{ row.description }}
                td {{ row.amount }}
                td
                  button.button.is-primary.is-small(@click.prevent="ch_sts(row.id, 1)") Paid
                  button.button.is-danger.is-small(@click.prevent="ch_sts(row.id, 2)" style="margin-left:5px;") Cancel
                td.receipt_con
                  template(v-if="row.receipt")
                    a.anch(href="#") REF {{ "#"+row.receipt }}
                  template(v-else)
                    .upload(v-if="$store.getters['receipts_upload/hasFile'](row.id)" @click.prevent="uploadFile(row.member_id, row.id)")
                      span UPLOAD&nbsp;&nbsp;&nbsp;
                      b-icon(icon="upload")
                      b-icon.del(icon="times-circle" @click.prevent.stop.native="$store.commit('receipts_upload/remFile', row.id)")
                    b-upload(v-else @input="$store.dispatch('receipts_upload/fileChange', {e: $event, id: row.id})")
                      span UPLOAD&nbsp;&nbsp;&nbsp;
                      b-icon(icon="plus-circle")
</template>

<script>
import _ from "lodash";
import tableComp from "~/components/html_comp/tableComp.vue";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
export default {
  layout: "admin_layout",
  components: {
    tableComp,
    tblTopFilter
  },
  async mounted() {
    const self = this;
    self.loading = true;
    self.loadCM();
    self.loading = false;
  },
  destroyed() {
    this.$store.commit("receipts_upload/resetFile");
  },
  data() {
    return {
      loading: false,
      tot_rows: 1,
      ren_data: [],
      params: {
        limit: 10,
        page: 1,
        search: ""
      }
    };
  },
  methods: {
    loadCM: async function() {
      const self = this;
      await self.$axios
        .get("/api/commission/un_paid", { params: self.params })
        .then(res => {
          self.tot_rows = res.data.tot_rows;
          self.ren_data = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    ch_sts: async function(id, type) {
      const self = this;
      self.loading = true;
      await self.$axios
        .post("/api/commission/set_sts", {
          id,
          type
        })
        .then(async res => {
          await self.loadCM();
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    },
    uploadFile: async function(mem_id, cm_id) {
      const self = this;
      self.loading = true;
      let form_data = new FormData();
      form_data.append("mem_id", mem_id);
      form_data.append("cm_id", cm_id);
      form_data.append(
        "receipt",
        self.$store.state.receipts_upload.sel_file[cm_id],
        self.$store.state.receipts_upload.sel_file[cm_id].name
      );
      let config = {
        headers: { "content-type": "multipart/form-data" }
      };
      await this.$axios
        .post("/api/receipt/upload_cm_rcp", form_data, config)
        .then(async res => {
          if (res.data.status === true) {
            self.$store.commit("receipts_upload/remFile", cm_id);
            await self.loadCM();
          } else {
            self.$toast.open({
              duration: 3000,
              message: "Uploading Error",
              position: "is-bottom",
              type: "is-danger"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
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
          await self.loadCM();
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
