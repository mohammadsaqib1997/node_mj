<template lang="pug">
    .wrapper
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Moderators Profile
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

                    table-comp(:arr="data" :loading="loading" )
                        template(slot="thead")
                            tr
                                th(width="50px")
                                th ID
                                th Email
                                th Name
                                th Status
                        template(slot="tbody")
                            tr(v-for="row in data")
                                td.ed-con
                                    button.button.ed-btn(v-on:click.prevent="o_e_mod_m(row.id)")
                                        b-icon(icon="edit")
                                        | &nbsp;&nbsp;&nbsp;EDIT
                                td {{ row.id }}
                                td {{ row.email }}
                                td {{ row.full_name }}
                                td {{ (row.active_sts === 1) ? 'Active':'Suspended' }}
                    // .table-des-1
                    //     template(v-if="data.length > 0")
                    //         table.table.is-fullwidth.is-bordered
                    //             thead
                    //                 tr
                    //                     th(width="50px")
                    //                     th ID
                    //                     th Email
                    //                     th Name
                    //                     th Status
                    //             tbody
                    //                 tr(v-for="row in data")
                    //                     td.ed-con
                    //                         button.button.ed-btn(v-on:click.prevent="o_e_mod_m(row.id)")
                    //                             b-icon(icon="edit")
                    //                             | &nbsp;&nbsp;&nbsp;EDIT
                    //                     td {{ row.id }}
                    //                     td {{ row.email }}
                    //                     td {{ row.full_name }}
                    //                     td {{ (row.active_sts === 1) ? 'Active':'Suspended' }}
                    //         .level
                    //             .level-left
                    //                 p.page-result-txt Showing 15 of  430 results
                    //             .level-right
                    //                 b-pagination(:total="100" :per-page="10" :current.sync="currentPg")
                    //     section.section.em-sec(v-else)
                    //         .content.has-text-grey.has-text-centered
                    //             p
                    //                 b-icon(icon="frown" pack="far" size="is-large")
                    //             p Nothing here.
                    //     b-loading(:is-full-page="false" :active="loading" :can-cancel="false")

        b-modal.modal-des-1(:active="modalActive" :has-modal-card="true" :canCancel="false")
            .modal-card
                #ed-moderator-con.modal-card-body
                    ed-moderator-form(:edit_id="select_edit")
</template>

<script>
import edModeratorForm from "~/components/forms/ed-moderator.vue";
import tableComp from "~/components/html_comp/tableComp.vue";
export default {
  layout: "admin_layout",
  components: {
    edModeratorForm,
    tableComp
  },
  async mounted() {
    this.loading = true;
    const res = await this.$axios.$get("/api/moderator/");
    this.data = res.data;
    this.loading = false;
  },
  computed: {
    modalActive: function() {
      return this.$store.state.edModModal.modalActive;
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
      loading: true,
      data: [],
      select_edit: null
    };
  },
  methods: {
    o_e_mod_m: function(id) {
      this.select_edit = id.toString();
      this.$store.commit("edModModal/setModalActive", true);
    }
  }
};
</script>