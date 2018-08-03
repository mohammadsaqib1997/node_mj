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
                    
                    .table-des-1
                      template(v-if="data.length > 0")
                        table.table.is-fullwidth.is-bordered
                          thead
                            tr
                              th(width="50px")
                              th ID
                              th Email
                              th Name
                              th Status
                              th Receipt
                          tbody
                            tr(v-for="row in data")
                              td.ed-con
                                button.button.ed-btn(v-on:click.prevent="o_e_mem_m(row.m.user_asn_id)")
                                  b-icon(icon="edit")
                                  | &nbsp;&nbsp;&nbsp;EDIT
                              td {{ row.m.user_asn_id }}
                              td {{ row.m.email }}
                              td {{ row.m.full_name }}
                              td {{ (row.m.active_sts === 1) ? 'Approved':'Suspended' }}
                              td.receipt_con
                                template(v-if="row.ur.receipt")
                                  a.anch(href="#") REF {{ "#"+row.ur.receipt }}
                                template(v-else)
                                  .upload(v-if="sel_file.hasOwnProperty(row.m.user_asn_id)" v-on:click.prevent="uploadFile(row.m.user_asn_id, row.m.id)")
                                    span UPLOAD&nbsp;&nbsp;&nbsp;
                                    b-icon(icon="upload")
                                    b-icon.del(icon="times-circle" v-on:click.prevent.stop.native="delFile(row.m.user_asn_id)")
                                  b-upload(v-else v-on:input="fileChange($event, row.m.user_asn_id)")
                                    span UPLOAD&nbsp;&nbsp;&nbsp;
                                    b-icon(icon="plus-circle")
                        .level
                          .level-left
                            p.page-result-txt Showing 15 of  430 results
                          .level-right
                            b-pagination(:total="100" :per-page="10" :current.sync="currentPg")
                      section.section.em-sec(v-else)
                        .content.has-text-grey.has-text-centered
                            p
                                b-icon(icon="frown" pack="far" size="is-large")
                            p Nothing here.
                      b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
        b-modal.modal-des-1(:active="modalActive" :has-modal-card="true" :canCancel="false")
            .modal-card
                #ed-member-con.modal-card-body
                    ed-member-form(:edit_id="select_edit")
</template>

<script>
import edMemberForm from "~/components/forms/ed-member.vue";
export default {
  layout: "admin_layout",
  components: {
    edMemberForm
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
      select_edit: null,
      sel_file: {},
      currentPg: 1
    };
  },
  methods: {
    dataLoad: async function() {
      this.loading = true
      this.data = [];
      const result = await this.$axios.$get("/api/member/");
      this.data = result.data;
      this.loading = false
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
    uploadFile: function(id, mem_uid) {
      const self = this;
      self.loading = true
      let form_data = new FormData();
      form_data.append("member_id", mem_uid);
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
            self.dataLoad();
          } else {
            self.loading = false
            self.$toast.open({
              duration: 3000,
              message: "Uploading Error",
              position: "is-bottom",
              type: "is-danger"
            });
          }
        })
        .catch(err => {
          self.loading = false
          console.log(err);
        });
    }
  }
};
</script>

