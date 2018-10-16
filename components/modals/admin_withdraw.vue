<template>
  <b-modal class="admin-wd" :active.sync="modalAct" :canCancel="cancelMD">
    <div class="box main-box">
      <div class="header">
        <h1>Withdraw Amount</h1>
      </div>
      <div class="body">
        <div class="section">
          <h2 class="title">Wallet</h2>
          <div class="wallet-sc">
            <img src="~/assets/img/wallet.png">
            <div class="amount">
              <span class="placeholder">Rs.</span>
              <span>{{ wallet }}</span>
            </div>
          </div>
          <hr>
          <form class="form" @submit.prevent="withdraw">
            <label>Enter Amount</label>
            <b-field :type="(validation.hasError('amount')) ? 'is-danger':''" :message="validation.firstError('amount')">
              <b-input type="text" placeholder="Enter Amount in Rupees" v-model="amount" v-mask="'#######'"></b-input>
            </b-field>
            <button class="button btn-des-1">
              <img src="~/assets/img/transfer.png">
              &nbsp;&nbsp;&nbsp;&nbsp;Withdraw
            </button>
          </form>
        </div>
        <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mask } from "vue-the-mask";
import mxn_modal from "~/mixins/modal.js";
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
      amount: "",
      cancelMD: ["outside", "x"]
    };
  },
  validators: {
    amount: function(value) {
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
    withdraw: function() {
      const self = this;

      self.$validate().then(async function(success) {
        if (success) {
          let is_err = false;
          let msg = "";
          self.loading = true;
          self.cancelMD = false;
          await self.$axios
            .post("/api/admin/withdraw", {
              amount: self.amount
            })
            .then(async res => {
              await self.$store.dispatch("admin/loadWallet");
              await self.$store.dispatch("notification/load_tbar_list");
              // await self.$store.dispatch("transaction/loadTransaction");
              msg = "Successfully Amount Withdraw.";
              self.reset_form();
            })
            .catch(err => {
              is_err = true;
              msg = err.message;
              console.log(err);
            });
          self.loading = false;
          self.cancelMD = ["outside", "x"];
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
      this.amount = "";
      this.validation.reset();
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-wd /deep/ {
  .box > .body {
    position: relative;
    .wallet-sc > img {
      max-height: 100%;
    }
  }
}
</style>


