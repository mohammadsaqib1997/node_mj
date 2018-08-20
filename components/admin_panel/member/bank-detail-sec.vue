<template lang="pug">
    .bank-detail-sec
        h2.title Bank Details
        .show-info(v-if="!is_empty(bank_det_data)")
            .columns.is-gapless
                .column
                    label Bank Name
                .column
                    h2 {{ bank_det_data.bank_name }}

            .columns.is-gapless
                .column
                    label Branch
                .column
                    h2 {{ bank_det_data.branch }}
            
            .columns.is-gapless
                .column
                    label Branch Code
                .column
                    h2 {{ bank_det_data.branch_code }}
            
            .columns.is-gapless
                .column
                    label Account Title
                .column
                    h2 {{ bank_det_data.account_title }}

            .columns.is-gapless
                .column
                    label Account Number
                .column
                    h2 {{ bank_det_data.account_number }}

            .columns.is-gapless
                .column
                    label IBAN
                .column
                    h2 {{ bank_det_data.iban_number }}

            .columns.is-gapless
                .column
                    label Address
                .column
                    h2 {{ bank_det_data.address }}
                       
        button.button.btn-des-1(v-if="is_empty(bank_det_data)")
            b-icon(icon="university")
            | &nbsp;&nbsp;&nbsp;&nbsp;Add Bank Details
        button.button.btn-des-1(v-else)
            b-icon(icon="university")
            | &nbsp;&nbsp;&nbsp;&nbsp;Edit Bank Details
</template>

<script>
import _ from "lodash";
export default {
  async mounted() {
    this.loading = true;
    await this.bank_det_load();
    this.loading = false;
  },
  data() {
    return {
      bank_det_data: {}
    };
  },
  methods: {
    bank_det_load: async function() {
      const result = await this.$axios.$get(
        "/api/bank-detail/" + this.$store.state.user.data.user_id
      );
      //console.log(result);
      this.bank_det_data = result.data;
    },
    is_empty: function(data) {
      return _.isEmpty(data);
    }
  }
};
</script>

