<template lang="pug">
    .fund-details
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Withdraw Amount
            .body
                .section
                    .columns.is-gapless
                        .column.is-narrow
                            h2.title Wallet
                            .wallet-sc
                                img(src="~/assets/img/wallet.png")
                                .amount
                                    span.placeholder Rs.
                                    span {{ $store.state.member.wallet }}
                        .column
                            bankDetComp
                    hr
                    form.form(@submit.prevent="withdraw")
                        .columns.is-variable.is-1
                            .column.is-3
                                label Withdraw Amount
                            .column
                                b-field(:type="(validation.hasError('form.amount')) ? 'is-danger':''" :message="validation.firstError('form.amount')")
                                    b-input(type="text" placeholder="Enter Amount in Rupees" v-model="form.amount" v-mask="'#######'")
                        .columns.is-variable.is-1
                            .column.is-offset-3
                                button.button.btn-des-1(type="submit" style="margin-top:0")
                                    img(src="~/assets/img/transfer.png")
                                    | &nbsp;&nbsp;&nbsp;&nbsp;Withdraw
                    b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
                    
</template>

<script>
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
import bankDetComp from "~/components/admin_panel/member/bank-detail-sec.vue";
export default {
  layout: "admin_layout",
  components: {
    bankDetComp
  },
  directives: {
    mask
  },
  mounted() {
    this.$store.dispatch("member/loadWallet");
  },
  data() {
    return {
      form: {
        loading: false,
        amount: ""
      }
    };
  },
  validators: {
    "form.amount": function(value) {
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
          if (parseInt(self.$store.state.member.wallet) < parseInt(value)) {
            return "You reached your wallet amount!";
          }
        });
      }
    }
  },
  methods: {
    withdraw: function() {
      const self = this;

      self.$validate().then(async function(success) {
        if (success) {
          self.form.loading = true;
          let is_err = false;
          let msg = "";
          await self.$axios
            .post("/api/commission/withdraw", {
              id: self.$store.state.user.data.user_id,
              amount: self.form.amount
            })
            .then(async res => {
              if (res.data.status !== false) {
                self.reset_form();
                msg = "Successfully Withdraw Request Submitted.";
                await self.$store.dispatch("member/loadWallet");
              } else {
                is_err = true;
                msg = res.data.message;
              }
            })
            .catch(err => {
              is_err = true;
              msg = "Server Error!";
            });

          self.form.loading = false;
          self.$toast.open({
            duration: 3000,
            message: msg,
            position: "is-bottom",
            type: is_err ? "is-danger" : "is-success"
          });
        }
      });
    },
    reset_form: function() {
      this.form["amount"] = "";
      this.validation.reset();
    }
  }
};
</script>
