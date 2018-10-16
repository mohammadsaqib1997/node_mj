<template lang="pug">
  b-modal.md-tr(:active.sync="modalAct" :canCancel="cancelMD")
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Transfer Funds To User
      .body
        .section
          .columns.is-gapless
            .column.is-narrow
              h2.title Wallet
              .wallet-sc
                img(src="~/assets/img/wallet.png")
                .amount
                  span.placeholder Rs.
                  span {{ wallet }}
            .column
              h2.title Transfer Details
              form.form(@submit.prevent="send_funds")
                label Enter User ID
                .columns
                  .column
                    b-field(:type="(validation.hasError('funds_form.u_id')) ? 'is-danger':''" :message="validation.firstError('funds_form.u_id')")
                      b-input(type="text" placeholder="User ID" v-model="funds_form.u_id" v-mask="'#########'" :loading="validation.isValidating('funds_form.u_id')")
                  .column
                    b-field
                      b-input(type="text" placeholder="User Name" readonly :value="funds_form.name")

                label Enter Transfer Amount
                b-field(:type="(validation.hasError('funds_form.amount')) ? 'is-danger':''" :message="validation.firstError('funds_form.amount')")
                  b-input(type="text" placeholder="Enter Amount in Rupees" v-model="funds_form.amount" v-mask="'#######'")
                button.button.btn-des-1
                  img(src="~/assets/img/transfer.png")
                  | &nbsp;&nbsp;&nbsp;&nbsp;Transfer Funds
          b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
import mxn_modal from "~/mixins/modal.js";
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  mixins: [mxn_modal],
  directives: {
    mask
  },
  computed: {
    wallet: function() {
      return this.$store.state.admin.wallet;
    }
  },
  data() {
    return {
      loading: false,
      funds_form: {
        submitted: false,
        u_id: "",
        amount: "",
        name: ""
      },
      cancelMD: ["outside", "x"]
    };
  },
  validators: {
    "funds_form.u_id": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
        self.funds_form.name = "";
        if (
          self.funds_form.submitted ||
          self.validation.isTouched("funds_form.u_id")
        ) {
          let validator = Validator.value(value)
            .required()
            .digit()
            .length(9);

          if (validator.hasImmediateError()) {
            return validator;
          } else {
            return validator.custom(() => {
              return self.$axios
                .post("/api/admin/user_id_check", {
                  recv_user_ans_id: value
                })
                .then(res => {
                  if (res.data.data.count < 1) {
                    return "Invalid user id.";
                  } else {
                    self.funds_form.name = res.data.data.full_name;
                  }
                });
            });
          }
        }
      }
    },
    "funds_form.amount": function(value) {
      const self = this;
      let validator = Validator.value(value)
        .required()
        .digit()
        .greaterThanOrEqualTo(100, "Minimum amount transfer 100!")
        .lessThanOrEqualTo(1000000, "Maximum amount transfer 1000000!");

      if (validator.hasImmediateError()) {
        return validator;
      } else {
        return validator.custom(() => {
          if (parseInt(self.wallet) < parseInt(value)) {
            return "You reached your wallet amount!";
          }
        });
      }
    }
  },
  methods: {
    async loadData() {
      this.loading = true;
      await this.$store.dispatch("admin/loadWallet");
      this.loading = false;
    },
    send_funds: function() {
      const self = this;
      self.funds_form.submitted = true;
      self.loading = true;
      let is_err = false;
      let msg = "";

      self.$validate().then(async function(success) {
        if (success) {
          self.cancelMD = false;
          await self.$axios
            .post("/api/admin/transfer_funds", {
              user_asn_id: self.funds_form.u_id,
              amount: self.funds_form.amount
            })
            .then(async res => {
              if (res.data.status !== false) {
                self.reset_funds_form();
                msg = "Successfully Funds Transfer.";
                await self.loadData();
                await self.$store.dispatch("notification/load_tbar_list");
              } else {
                is_err = true;
                msg = res.data.message;
              }
            })
            .catch(err => {
              is_err = true;
              msg = "Server Error!";
            });

          self.loading = false;
          self.cancelMD = ["outside", "x"];
          self.$toast.open({
            duration: 3000,
            message: msg,
            position: "is-bottom",
            type: is_err ? "is-danger" : "is-success"
          });
        } else {
          self.loading = false;
        }
      });
    },
    reset_funds_form: function() {
      this.funds_form["u_id"] = "";
      this.funds_form["amount"] = "";
      this.funds_form["name"] = "";
      this.funds_form["submitted"] = false;
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.md-tr {
  /deep/ {
    .modal-content {
      width: 960px;
      max-width: 100% !important;
      .wallet-sc {
        img {
          max-height: 100%;
        }
      }
    }
  }
}
</style>


