<template lang="pug">
  div
    .level.wl-top-level
      .level-left
        .wallet-cont
          | Wallet:
          span.amount Rs, {{ wallet }}/-
      .level-right
        button.button.wd-btn(@click.prevent="mdAct = true") Withdraw
        b-modal.md-tr(:active.sync="mdAct")
          .box.main-box
            .header.columns.is-gapless
              .column
                h1 Withdraw Amount
            .body
              .section
                h2.title Wallet
                .wallet-sc
                  img(src="~/assets/img/wallet.png")
                  .amount
                    span.placeholder Rs.
                    span {{ wallet }}
                hr
                form.form(@submit.prevent="withdraw")
                  label Enter Amount
                  b-field(:type="(validation.hasError('form.amount')) ? 'is-danger':''" :message="validation.firstError('form.amount')")
                      b-input(type="text" placeholder="Enter Amount in Rupees" v-model="form.amount" v-mask="'#######'")
                  button.button.btn-des-1
                      img(src="~/assets/img/transfer.png")
                      | &nbsp;&nbsp;&nbsp;&nbsp;Withdraw

                b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  async mounted() {
    this.$store.commit("admin/setLoader", true);
    await this.$store.dispatch("admin/loadWallet");
    this.$store.commit("admin/setLoader", false);
  },
  directives: {
    mask
  },
  computed: {
    wallet: function() {
      return this.$store.state.admin.wallet;
    },
    loading: function() {
      return this.$store.state.admin.loading;
    }
  },
  data() {
    return {
      mdAct: false,
      form: {
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
          if (parseInt(self.wallet) < parseInt(value)) {
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
          let is_err = false;
          let msg = "";

          self.$store.commit("admin/setLoader", true);
          await self.$axios
            .post("/api/admin/withdraw", {
              amount: self.form.amount
            })
            .then(async res => {
              await self.$store.dispatch("admin/loadWallet");
              await self.$store.dispatch("notification/n_list_load", {
                limit: 5
              });
              await self.$store.dispatch("transaction/loadTransaction");
              msg = "Successfully Amount Withdraw.";
              self.reset_form();
            })
            .catch(err => {
              is_err = true;
              msg = err.message;
              console.log(err);
            });
          self.$store.commit("admin/setLoader", false);
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


<style lang="scss" scoped>
.wl-top-level {
  margin-bottom: 1.6rem;
}

.wallet-cont {
  font-size: 2.2rem;
  font-weight: 300;
  color: #454545;
  margin-bottom: 10px;
  .amount {
    margin-left: 8px;
    font-weight: 500;
  }
}

.wd-btn {
  padding: 12px 22px;
  height: auto;
  border-radius: 0;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d9bd68;
  box-shadow: 0 3px 15px #dcdcdc;
  margin-bottom: 10px;
  &:focus {
    box-shadow: 0 3px 15px #dcdcdc;
  }
}

.wd-btn {
  color: #454545;
  &:hover {
    color: #d9bd68;
  }
}

// .md-tr /deep/ {
//   .modal-content {
//     width: 960px;
//     max-width: 100% !important;
//   }
// }
</style>


