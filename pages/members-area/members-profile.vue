<template lang="pug">
  .wrapper
    .box.main-box
      .header.columns.is-gapless
        .column
            h1 Members Profile
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
            b-field.search-field(expanded)
              p.control.has-icons-right
                input.input(type="search" placeholder="Search")
                span.icon.is-right
                  i.fas.fa-search
            b-field.view-field
              p.control
                button.button
                  b-icon(icon="eye" pack="fas")
                  | &nbsp;&nbsp;&nbsp;VIEW
          
          table-comp(:arr="data" :loading="loading" :total_record="num_rows" @page_change="pageLoad")
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
                    .upload(v-if="sel_file.hasOwnProperty(row.m.id)" v-on:click.prevent="uploadFile(row.m.id)")
                      span UPLOAD&nbsp;&nbsp;&nbsp;
                      b-icon(icon="upload")
                      b-icon.del(icon="times-circle" v-on:click.prevent.stop.native="delFile(row.m.id)")
                    b-upload(v-else v-on:input="fileChange($event, row.m.id)")
                      span UPLOAD&nbsp;&nbsp;&nbsp;
                      b-icon(icon="plus-circle")

    b-modal.modal-des-1(:active="modalActive" :has-modal-card="true" :canCancel="false")
      .modal-card
        #ed-member-con.modal-card-body
          ed-member-form(:edit_id="select_edit" v-on:update_member="dataLoad(page_active)")
</template>

<script>
import edMemberForm from "~/components/forms/ed-member.vue";
import tableComp from "~/components/html_comp/tableComp.vue";

export default {
  layout: "admin_layout",
  components: {
    edMemberForm,
    tableComp
  },
  async mounted() {
    this.dataLoad();
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
      loading: false,
      data: [],
      num_rows: 0,
      select_edit: null,
      sel_file: {},
      page_active : 1
    };
  },
  methods: {
    dataLoad: async function(page) {
      if(!page) {
        this.page_active = 1
      }else{
        this.page_active = page
      }
      this.loading = true;
      const result = await this.$axios.$get("/api/member?page="+this.page_active);
      this.num_rows = result.total_rows;
      this.data = result.data;
      this.loading = false;
    },
    pageLoad: function (page) {
      this.dataLoad(page)
    },
    payUser: function(id) {
      const self = this;
      self.loading = true;
      self.$axios
        .post("/api/member/pay_user", { id })
        .then(res => {
          if (res.data.status === true) {
            self.dataLoad(this.page_active);
          } else {
            console.log("Extra Code!", res.data);
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
    fileChange: function(e, id) {
      if (e[0].type === "image/png" || e[0].type === "image/jpeg") {
        if (e[0].size <= 5000000) {
          this.$set(this.sel_file, id, e);
        } else {
          this.$toast.open({
            duration: 3000,
            message: "Maximum Upload File Size Is 5MB!",
            position: "is-bottom",
            type: "is-danger"
          });
        }
      } else {
        this.$toast.open({
          duration: 3000,
          message: "Invalid File Selected!",
          position: "is-bottom",
          type: "is-danger"
        });
      }
    },
    delFile: function(id) {
      this.$delete(this.sel_file, id);
    },
    uploadFile: function(id) {
      const self = this;
      self.loading = true;
      let form_data = new FormData();
      form_data.append("member_id", id);
      form_data.append("type", 0);
      form_data.append(
        "receipt",
        this.sel_file[id][0],
        this.sel_file[id][0].name
      );
      let config = {
        headers: { "content-type": "multipart/form-data" }
      };
      this.$axios
        .post("/api/member/receipt_add", form_data, config)
        .then(res => {
          if (res.data.status === true) {
            self.delFile(id);
            self.dataLoad(self.page_active);
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

