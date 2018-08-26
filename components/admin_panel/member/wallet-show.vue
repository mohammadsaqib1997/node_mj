<template lang="pug">
    div
        .level.wl-top-level
            .level-left
                .wallet-cont
                    | Wallet:
                    span.amount Rs, {{ $store.state.member.wallet }}/-
            .level-right
                button.button.tr-btn(@click.prevent="trnsModalAct = true") Transfer Funds
                nuxt-link.button.wd-btn(to="/withdraw") Withdraw
        b-modal.md-tr(:active.sync="trnsModalAct")
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
                                        span {{ $store.state.member.wallet }}
                            .column
                                h2.title Transfer Details
                                form.form(@submit.prevent="send_funds")
                                    label Enter User ID
                                    b-field(:type="(validation.hasError('funds_form.u_id')) ? 'is-danger':''" :message="validation.firstError('funds_form.u_id')")
                                        b-input(type="text" placeholder="User ID" v-model="funds_form.u_id" v-mask="'#########'")
                                    label Enter Transfer Amount
                                    b-field(:type="(validation.hasError('funds_form.amount')) ? 'is-danger':''" :message="validation.firstError('funds_form.amount')")
                                        b-input(type="text" placeholder="Enter Amount in Rupees" v-model="funds_form.amount" v-mask="'#######'")
                                    button.button.btn-des-1
                                        img(src="~/assets/img/transfer.png")
                                        | &nbsp;&nbsp;&nbsp;&nbsp;Transfer Funds
                        b-loading(:is-full-page="false" :active="funds_form.loading" :can-cancel="false")
</template>

<script>
import { mask } from "vue-the-mask";
import SimpleVueValidation from "simple-vue-validator";
const Validator = SimpleVueValidation.Validator;
export default {
  mounted() {
    this.$store.dispatch("member/loadWallet");
  },
  directives: {
    mask
  },
  data() {
    return {
      trnsModalAct: false,
      funds_form: {
        submitted: false,
        loading: false,
        u_id: "",
        amount: ""
      }
    };
  },
  validators: {
    "funds_form.u_id": {
      cache: false,
      debounce: 500,
      validator: function(value) {
        const self = this;
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
                .post("/api/commission/user_id_check", {
                  user_id: self.$store.state.user.data.user_id,
                  recv_user_ans_id: value
                })
                .then(res => {
                  if (res.data.count < 1) {
                    return "Invalid user id.";
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
          if (parseInt(self.$store.state.member.wallet) < parseInt(value)) {
            return "You reached your wallet amount!";
          }
        });
      }
    }
  },
  methods: {
    send_funds: function() {
      const self = this;
      self.funds_form.submitted = true;
      self.funds_form.loading = true;
      let is_err = false;
      let msg = "";

      self.$validate().then(async function(success) {
        if (success) {
          await self.$axios
            .post("/api/commission/transfer_funds", {
                id: self.$store.state.user.data.user_id,
                user_asn_id: self.funds_form.u_id,
                amount: self.funds_form.amount
            })
            .then(async res => {
              if (res.data.status !== false) {
                self.reset_funds_form();
                msg = "Successfully Funds Transfer.";
                await self.$store.dispatch("member/loadWallet");
                await self.$store.dispatch('member/transactions/loadTransactions');
              } else {
                is_err = true;
                msg = res.data.message;
              }
            })
            .catch(err => {
              is_err = true;
              msg = "Server Error!";
            });

          self.funds_form.loading = false;
          self.$toast.open({
            duration: 3000,
            message: msg,
            position: "is-bottom",
            type: is_err ? "is-danger" : "is-success"
          });
        } else {
          self.funds_form.loading = false;
        }
      });
    },
    reset_funds_form: function() {
      this.funds_form["u_id"] = "";
      this.funds_form["amount"] = "";
      this.funds_form["submitted"] = false;
      this.validation.reset();
    }
  }
};
</script>


<style lang="sass" scoped>
.wl-top-level
    margin-bottom: 1.6rem
.wallet-cont
    font-size: 2.2rem
    font-weight: 300
    color: #454545
    margin-bottom: 10px
    .amount
        margin-left: 8px
        font-weight: 500
.tr-btn, .wd-btn
    padding: 12px 22px
    height: auto
    border-radius: 0
    text-transform: uppercase
    font-size: 14px
    font-weight: 500
    border: 1px solid #d9bd68
    box-shadow: 0 3px 15px #dcdcdc
    margin-bottom: 10px
    &:focus
        box-shadow: 0 3px 15px #dcdcdc
.tr-btn
    margin-right: 10px
    background-color: #d9bd68
    &:hover
        color: #ffffff
.wd-btn
    color: #454545
    &:hover
        color: #d9bd68

.md-tr
    /deep/
        .modal-content
            width: 960px
            max-width: 100% !important
            
</style>


