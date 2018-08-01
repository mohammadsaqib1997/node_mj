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
                    b-table.table-des-1(:data="data" :bordered="true" paginated :per-page="10")
                        template(slot-scope="props")
                            b-table-column.ed-con(width="50")
                                button.button.ed-btn(v-on:click.prevent="o_e_mem_m(props.row.user_asn_id)")
                                    b-icon(icon="edit")
                                    | &nbsp;&nbsp;&nbsp;EDIT
                            b-table-column(field="user_asn_id" label="ID" width="40")
                                | {{ props.row.user_asn_id }}
                            b-table-column(field="email" label="Email" )
                                | {{ props.row.email }}
                            b-table-column(field="full_name" label="Name" )
                                | {{ props.row.full_name }}
                            b-table-column(field="status" label="Status" )
                                | {{ (props.row.active_sts === 1) ? 'Approved':'Suspended' }}
                            b-table-column.receipt_con(field="receipt" label="Receipt" )
                                template(v-if="props.row.receipt")
                                    a.anch(href="#") REF {{ "#"+props.row.receipt }}
                                template(v-else)
                                    .upload
                                        span UPLOAD&nbsp;&nbsp;&nbsp;
                                        b-icon(icon="plus-circle")
                        template(slot="bottom-left")
                            p.page-result-txt Showing 15 of  430 results
                        template(slot="empty")
                            section.section
                                .content.has-text-grey.has-text-centered
                                    p
                                        b-icon(icon="frown" pack="far" size="is-large")
                                    p Nothing here.
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
    const res = await this.$axios.$get("/api/member/");
    this.data = res.data;
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
      data: [],
      select_edit: null
    };
  },
  methods: {
    o_e_mem_m: function(id) {
      this.select_edit = id;
      this.$store.commit("edMemModal/setModalActive", true);
    }
  }
};
</script>
