<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless
        .column
            h1 Members Profile
      .body
        .section
          tblTopFilter(:act_view="load_params.limit" :s_txt="load_params.search" @change_act_view="updateFilter('limit', $event)" @change_s_txt="updateFilter('search', $event)")
          table-comp(:arr="data" :loading="loading" :total_record="num_rows" :per_page="parseInt(load_params.limit)" :page_set="load_params.page" @page_change="pageLoad")
            template(slot="thead")
              tr
                th(width="50px")
                th ID
                th Email
                th Name
                th Status
                th Paid Status
                th Receipt
            template(slot="tbody")
              tr(v-for="row in data")
                td.ed-con
                  button.button.ed-btn(v-on:click.prevent="o_e_mem_m(parseInt(row.m.id))")
                    b-icon(icon="edit")
                    | &nbsp;&nbsp;&nbsp;EDIT
                td {{ row.m.user_asn_id }}
                td {{ row.m.email }}
                td {{ row.m.full_name }}
                td {{ (row.m.active_sts === 1) ? 'Approved':'Suspended' }}
                td
                  template(v-if="row.m.is_paid_m == 1") Paid
                  template(v-else)
                    button.button.is-small.is-info(@click.prevent="payUser(row.m.id)") Pay
                td.receipt_con
                  template(v-if="row.ur.receipt")
                    a.anch(href="#") REF {{ "#"+row.ur.receipt }}
                  template(v-else)
                    .upload(v-if="$store.getters['receipts_upload/hasFile'](row.m.id)" @click.prevent="uploadFile(row.m.id)")
                      span UPLOAD&nbsp;&nbsp;&nbsp;
                      b-icon(icon="upload")
                      b-icon.del(icon="times-circle" @click.prevent.stop.native="$store.commit('receipts_upload/remFile', row.m.id)")
                    b-upload(v-else @input="$store.dispatch('receipts_upload/fileChange', {e: $event, id: row.m.id})")
                      span UPLOAD&nbsp;&nbsp;&nbsp;
                      b-icon(icon="plus-circle")

    b-modal.modal-des-1(:active="modalActive" :has-modal-card="true" :canCancel="false")
      .modal-card
        #ed-member-con.modal-card-body
          ed-member-form(:edit_id="select_edit" v-on:update_member="dataLoad")
</template>

<script>
import edMemberForm from "~/components/forms/ed-member.vue";
import tableComp from "~/components/html_comp/tableComp.vue";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import _ from "lodash";

export default {
  layout: "admin_layout",
  components: {
    edMemberForm,
    tableComp,
    tblTopFilter
  },
  async mounted() {
    this.dataLoad();
  },
  computed: {
    modalActive: function() {
      return this.$store.state.edMemModal.modalActive;
    }
  },
  destroyed() {
    this.$store.commit("receipts_upload/resetFile");
  },
  watch: {
    modalActive: function(val) {
      if (val === false) {
        this.select_edit = null;
      }
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      num_rows: 1,
      select_edit: null,
      load_params: {
        limit: "10",
        search: "",
        page: 1
      }
    };
  },
  methods: {
    dataLoad: async function() {
      this.loading = true;
      try {
        const result = await this.$axios.$get("/api/member", {
          params: this.load_params
        });
        this.num_rows = result.total_rows;
        this.data = result.data;
      } catch (err) {
        console.log(err);
      }

      this.loading = false;
    },

    pageLoad: function(page) {
      this.load_params.page = page;
      this.dataLoad();
    },

    updateFilter: function(param, val) {
      let new_params = _.cloneDeep(this.load_params);
      if (new_params[param] !== val) {
        this.num_rows = 1;
        _.set(new_params, "page", 1);
        _.set(new_params, param, val);
        this.load_params = new_params;
        this.loading = true;
        this.after_f_settle();
      }
    },

    after_f_settle: _.debounce(function() {
      this.dataLoad();
    }, 1000),

    payUser: function(id) {
      const self = this;
      self.loading = true;
      self.$axios
        .post("/api/member/pay_user", { id })
        .then(res => {
          if (res.data.status === true) {
            self.dataLoad();
          } else {
            console.log("Error! ", res.data);
          }
        })
        .catch(err => {
          self.loading = false;
          self.$toast.open({
            duration: 3000,
            message: "Server Error! " + err.message,
            position: "is-bottom",
            type: "is-danger"
          });
        });
    },

    o_e_mem_m: function(id) {
      this.select_edit = id;
      this.$store.commit("edMemModal/setModalActive", true);
    },

    uploadFile: function(id) {
      const self = this;
      self.loading = true;
      let form_data = new FormData();
      form_data.append("id", id);
      form_data.append(
        "receipt",
        self.$store.state.receipts_upload.sel_file[id],
        self.$store.state.receipts_upload.sel_file[id].name
      );
      let config = {
        headers: { "content-type": "multipart/form-data" }
      };
      this.$axios
        .post("/api/receipt/upload_pd_rcp", form_data, config)
        .then(res => {
          if (res.data.status === true) {
            self.$store.commit("receipts_upload/remFile", id);
            self.dataLoad();
          } else {
            self.loading = false;
            self.$toast.open({
              duration: 3000,
              message: "Uploading Error",
              position: "is-bottom",
              type: "is-danger"
            });
          }
        })
        .catch(err => {
          self.loading = false;
          console.log(err);
        });
    }
  }
};
</script>

