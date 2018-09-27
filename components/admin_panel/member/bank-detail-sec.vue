<template lang="pug">
    .bank-detail-sec
        h2.title(v-if="has_header") Bank Details
        .show-info(v-if="!is_empty(bank_det_data)")
            .columns.is-gapless
                .column
                    label Bank Name
                .column
                    h2 {{ bank_det_data.bank_name }}
            
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
                       
        button.button.btn-des-1(@click.prevent="modalActive=true;setData();")
            template(v-if="is_empty(bank_det_data)")
                b-icon(icon="university")
                | &nbsp;&nbsp;&nbsp;&nbsp;Add Bank Details
            template(v-else)
                b-icon(icon="university")
                | &nbsp;&nbsp;&nbsp;&nbsp;Update Bank Details

        nuxt-link.button.btn-des-1(to="/fund-manager/finance-details" style="margin-left: 10px")
            img(src="~/assets/img/btn-coin.png")
            | &nbsp;&nbsp;&nbsp;&nbsp;View Finances

        b-modal.modal-des-1(:active="modalActive" :has-modal-card="true" :canCancel="false")
            .modal-card
                .modal-card-body
                    .section
                        form.form(v-on:submit.prevent="update")
                            b-field(label="Bank Name" :type="(validation.hasError('f_data.bank_name')) ? 'is-danger':''" :message="validation.firstError('f_data.bank_name')")
                                b-input(type="text" placeholder="Enter Bank Name" v-model="f_data.bank_name")

                            b-field(label="Branch Code" :type="(validation.hasError('f_data.branch_code')) ? 'is-danger':''" :message="validation.firstError('f_data.branch_code')")
                                b-input(type="text" placeholder="Enter Branch Code" v-model="f_data.branch_code")

                            b-field(label="Account Title" :type="(validation.hasError('f_data.account_title')) ? 'is-danger':''" :message="validation.firstError('f_data.account_title')")
                                b-input(type="text" placeholder="Enter Account Title" v-model="f_data.account_title")

                            b-field(label="Account Number" :type="(validation.hasError('f_data.account_number')) ? 'is-danger':''" :message="validation.firstError('f_data.account_number')")
                                b-input(type="text" placeholder="Enter Account Number" v-model="f_data.account_number")

                            b-field(label="IBAN Number" :type="(validation.hasError('f_data.iban_number')) ? 'is-danger':''" :message="validation.firstError('f_data.iban_number')")
                                b-input(type="text" placeholder="Enter IBAN Number" v-model="f_data.iban_number")

                            b-field(label="Address" :type="(validation.hasError('f_data.address')) ? 'is-danger':''" :message="validation.firstError('f_data.address')")
                                b-input(type="text" placeholder="Enter Address" v-model="f_data.address")

                            .d-flex
                                button.button.btn-des-1(type="submit")
                                    template(v-if="is_empty(bank_det_data)")
                                        b-icon(icon="university" style="margin-top: 2px;")
                                        | &nbsp;&nbsp;&nbsp;&nbsp;Add
                                    template(v-else)
                                        b-icon(icon="edit" style="margin-top: 2px;")
                                        | &nbsp;&nbsp;&nbsp;&nbsp;Update
                                button.button.btn-des-1.dark(type="button" @click.prevent="modalActive=false") Cancel

                        b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
</template>

<script>
import _ from "lodash";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  props: {
    has_header: {
      type: Boolean,
      default: false
    }
  },
  async mounted() {
    this.loading = true;
    await this.bank_det_load();
    this.loading = false;
  },
  validators: {
    "f_data.bank_name": function(value) {
      return Validator.value(value)
        .minLength(6)
        .maxLength(50);
    },
    "f_data.branch_code": function(value) {
      return Validator.value(value)
        .minLength(6)
        .maxLength(50);
    },
    "f_data.account_title": function(value) {
      return Validator.value(value)
        .minLength(6)
        .maxLength(50);
    },
    "f_data.account_number": function(value) {
      return Validator.value(value)
        .minLength(6)
        .maxLength(50);
    },
    "f_data.iban_number": function(value) {
      return Validator.value(value)
        .minLength(6)
        .maxLength(50);
    },
    "f_data.address": function(value) {
      return Validator.value(value)
        .minLength(6)
        .maxLength(100);
    }
  },
  data() {
    return {
      modalActive: false,
      bank_det_data: {},
      f_data: {
        bank_name: "",
        branch_code: "",
        account_title: "",
        account_number: "",
        iban_number: "",
        address: ""
      },
      form: {
        loading: false
      }
    };
  },
  methods: {
    bank_det_load: async function() {
      const result = await this.$axios.$get(
        "/api/bank-detail/" + this.$store.state.user.data.user_id
      );
      this.bank_det_data = result.data;
    },
    update: function() {
      const self = this;
      self.$validate().then(async suc => {
        if (suc) {
          self.form.loading = true;
          let is_err = false;
          let msg = "";
          await self.$axios
            .post("/api/bank-detail/update", {
              data: self.f_data
            })
            .then(async res => {
              msg =
                "Successfully Bank Details " +
                (_.isEmpty(self.bank_det_data) ? "Added." : "Updated.");
              await self.bank_det_load();
              await self.$store.dispatch("profile/mayWalletReq");
            })
            .catch(err => {
              is_err = true;
              msg = "Server Error!";
              console.log(err);
            });
          self.form.loading = false;
          self.modalActive = false;
          self.$toast.open({
            duration: 3000,
            message: msg,
            position: "is-bottom",
            type: is_err ? "is-danger" : "is-success"
          });
        }
      });
    },
    setData: function() {
      const self = this;
      if (!self.is_empty(self.bank_det_data)) {
        self.f_data = {
          bank_name: self.bank_det_data.bank_name,
          branch: self.bank_det_data.branch,
          branch_code: self.bank_det_data.branch_code,
          account_title: self.bank_det_data.account_title,
          account_number: self.bank_det_data.account_number,
          iban_number: self.bank_det_data.iban_number,
          address: self.bank_det_data.address
        };
      }
    },
    is_empty: function(data) {
      return _.isEmpty(data);
    }
  }
};
</script>

<style scoped lang="scss">
.show-info {
  margin-bottom: 1rem;
}
.modal-des-1 {
  /deep/ {
    .section {
      padding: 3rem;
      .form {
        .field {
          .label {
            font-size: 18px;
            line-height: 18px;
            color: #828282;
          }
          .control {
            & > .icon.is-right.is-clickable {
              right: 8px;
              color: #d9bd68 !important;
            }
          }
        }
        .d-flex {
          @media screen and (min-width: 426px) {
            display: flex;
            justify-content: center;
          }
          & > .button {
            @media screen and (max-width: 425px) {
              width: 100%;
            }
            &:last-child {
              @media screen and (min-width: 426px) {
                margin-left: 1rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>

