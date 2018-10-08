<template lang="pug">
  b-modal.receipt-view(:active="modalAct" :canCancel="false")
    .box.main-box
      .header
        h1 Receipt View
      .body
        .section
          section.section.em-sec(v-if="ren_data.length < 1")
            .content.has-text-grey.has-text-centered
              p
                span.icon.is-large
                  i.far.fa-frown.fa-3x
              p Nothing here.

          table.table.is-fullwidth.is-bordered(v-else)
            thead
              tr
                th Date
                th File
                th Action
            tbody
              tr(v-for="row in ren_data")
                td {{ dateFT(row.date) }}
                td {{ row.file_name }}
                td 
                  b-field(grouped)
                    p.control
                      button.button.is-small.is-danger(@click.prevent="deleteReceipt(row.id)")
                        b-icon(icon="trash")
                    p.control
                      button.button.is-small.is-info(@click.prevent="download(row.id, row.file_name, type)")
                        b-icon(icon="download")

          hr
          b-field(grouped style="justify-content: flex-end;")
            button.button.btn-des-1(v-if="hasFile(ref_id)" style="margin-top:0;" @click.prevent="uploadFile(mem_id, ref_id, type)")
              b-icon(icon="upload")
            b-upload(v-else @input="fileChange({e: $event, id: ref_id})")
              .button.btn-des-1(style="margin-top:0;") Add
            button.button.btn-des-1.dark(@click.prevent="modalAct=false" style="margin-top:0;margin-left:1rem;") Close
      
          b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
import tableComp from "~/components/html_comp/tableComp.vue";
import mxn_receiptUpload from "~/mixins/receipt_upload.js";
import mxn_modal from '~/mixins/modal.js'
import moment from "moment";
export default {
  mixins: [mxn_receiptUpload, mxn_modal],
  components: {
    tableComp
  },
  props: {
    type: {
      type: Number,
      required: true
    },
    ref_id: {
      type: Number,
      default: null
    },
    mem_id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      ren_data: []
    };
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/receipt/get_list", {
          params: { ref_id: self.ref_id, type: self.type }
        })
        .then(res => {
          self.ren_data = res.data.results;
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    },
    dateFT(str) {
      return moment(new Date(str)).format("DD-MM-YYYY hh:mm:ss A");
    }
  }
};
</script>

<style lang="scss" scoped>
.receipt-view /deep/ {
  .em-sec {
    border: 1px solid #dbdbdb;
  }
  .table {
    tbody {
      td {
        font-size: 12px;
      }
    }
  }
}
</style>


