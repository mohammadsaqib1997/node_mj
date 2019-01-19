<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless
        .column
            h1 Members Profile
      .body
        .section
          tblTopFilter(:f_list="tbl_list_filters" @change_filter="change_filter_tr($event)" :filter_set="filter_val" :act_view="load_params.limit" :s_txt="load_params.search" @change_act_view="update_params('limit', $event)" @change_s_txt="update_params('search', $event)")
          table-comp(:arr="l_data" :loading="loading" :total_record="num_rows" :per_page="parseInt(load_params.limit)" :page_set="load_params.page" @page_change="update_params('page', $event)")
            template(slot="thead")
              tr
                th(width="50px")
                th ID
                th Email
                th Name
                th Branch
                th Status
                th Paid Status
                th Receipt
            template(slot="tbody")
              tr(v-for="row in l_data" @click.prevent="loadMemInfo(row.id)")
                td.ed-con
                  button.button.ed-btn(v-on:click.prevent.stop="o_e_mem_m(parseInt(row.id))")
                    b-icon(icon="edit")
                    | &nbsp;&nbsp;&nbsp;EDIT
                td {{ row.user_asn_id }}
                td {{ row.email }}
                td {{ row.full_name }}
                td {{ row.crzb_name }}
                td {{ (row.active_sts === 1) ? 'Approved':'Suspended' }}
                td
                  template(v-if="row.is_paid_m == 1") Paid
                  template(v-else)
                    button.button.is-small.is-info(@click.prevent.stop="payUser(row.id)") Pay
                td.receipt_con(@click.stop)
                  template(v-if="row.tot_rcp_up > 0")
                    .upload
                      span Total Receipts {{ row.tot_rcp_up }}&nbsp;&nbsp;&nbsp;
                      button.button.is-small.is-info(@click.prevent="rec_v_md=true;rv_ref_id=row.id;rv_mem_id=row.id")
                        | &nbsp;
                        b-icon(icon="eye" pack="far")
                        | &nbsp;

                  template(v-else)
                    .upload(v-if="hasFile(row.id)" @click.prevent="uploadFile(row.id, row.id, 0)")
                      span UPLOAD&nbsp;&nbsp;&nbsp;
                      b-icon(icon="upload")
                      b-icon.del(icon="times-circle" @click.prevent.stop.native="remFile(row.id)")
                    b-upload(v-else @input="fileChange({e: $event, id: row.id})")
                      span UPLOAD&nbsp;&nbsp;&nbsp;
                      b-icon(icon="plus-circle")

    b-modal.modal-des-1(:active="modalActive" :has-modal-card="true" :canCancel="false")
      .modal-card
        #ed-member-con.modal-card-body
          ed-member-form(:edit_id="select_edit" v-on:update_member="loadData")
    receiptView(:md_act="rec_v_md" :ref_id="rv_ref_id" :mem_id="rv_mem_id" :type="0" @closed="afterRVClosed")
    memberInfo(:md_act="mem_info_md" :mem_id="mem_info_md_mem_id" @closed="mem_info_md=false;mem_info_md_mem_id=null;")
</template>

<script>
import edMemberForm from "~/components/forms/ed-member.vue";
import tableComp from "~/components/html_comp/tableComp.vue";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import receiptView from "~/components/modals/receipt_view.vue";
import memberInfo from "~/components/modals/member_info.vue";
import _ from "lodash";

import mxn_receiptUpload from "~/mixins/receipt_upload.js";
import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";

export default {
  mixins: [mxn_receiptUpload, mxn_tableFilterListing],
  layout: "admin_layout",
  components: {
    edMemberForm,
    tableComp,
    tblTopFilter,
    receiptView,
    memberInfo
  },
  computed: {
    modalActive: function() {
      return this.$store.state.edMemModal.modalActive;
    }
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
      mem_info_md: false,
      mem_info_md_mem_id: null,
      rec_v_md: false,
      rv_ref_id: null,
      rv_mem_id: null,
      select_edit: null,
      tbl_list_filters: [
        { title: "Filter", value: '' },
        { title: "Suspended", value: 'suspend' },
        { title: "UnPaid", value: 'unpaid' },
        { title: "Paid", value: 'paid' },
        { title: "Level 0", value: 0 },
        { title: "Level 1", value: 1 },
        { title: "Level 2", value: 2 },
        { title: "Level 3", value: 3 },
        { title: "Level 4", value: 4 },
        { title: "Level 5", value: 5 },
        { title: "Level 6", value: 6 },
        { title: "Level 7", value: 7 },
        { title: "Level 8", value: 8 },
        { title: "Level 9", value: 9 }
      ],
    };
  },
  methods: {
    loadData: async function() {
      this.loading = true;
      try {
        const result = await this.$axios.$get("/api/member", {
          params: this.load_params
        });
        this.num_rows = result.total_rows;
        this.l_data = result.data;
      } catch (err) {
        console.log(err);
      }

      this.loading = false;
    },

    loadMemInfo(id) {
      this.mem_info_md = true;
      this.mem_info_md_mem_id = id;
    },

    payUser: function(id) {
      const self = this;
      self.loading = true;
      self.$axios
        .post("/api/member/pay_user", { id })
        .then(res => {
          if (res.data.status === true) {
            self.loadData();
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

