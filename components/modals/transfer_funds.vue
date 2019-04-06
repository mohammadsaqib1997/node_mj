<template lang="pug">
  b-modal.md-tr(:active.sync="trnsModalAct" @close="$emit('closed', true)")
    .box.main-box
      .header.columns.is-gapless
        .column
          h1 Transfer Funds
      .body
        .section
          .columns.is-gapless
            .column.is-narrow
              //- h2.title Wallet
              .wallet-sc
                img(src="~/assets/img/wallet.png")
                .amount
                  span.placeholder Rs. {{ $store.state.member.wallet }}/-
                  span Shopping Wallet
                // .amount
                //   span.placeholder Rs. 0/-
                //   span Wallet
            .column
              h2.title Transfer Details
              span.heading.has-text-danger Note: Funds transfer only admin.
              form.form(@submit.prevent="send_funds")
                //- label Enter User ID
                //- .columns
                //-   .column
                //-     b-field(:type="(validation.hasError('funds_form.u_id')) ? 'is-danger':''" :message="validation.firstError('funds_form.u_id')")
                //-       b-input(type="text" placeholder="User ID" v-model="funds_form.u_id" v-mask="'#########'")
                //-   .column
                //-     b-field
                //-       b-input(type="text" placeholder="User Name" readonly :value="funds_form.name")

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
  props: {
    openMD: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$store.dispatch("member/loadWallet");
  },
  watch: {
    openMD: function(value) {
      if (value !== this.trnsModalAct) {
        this.trnsModalAct = value;
      }
    }
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
        amount: "",
        name: ""
      }
    };
  },
  validators: {
    // "funds_form.u_id": {
    //   cache: false,
    //   debounce: 500,
    //   validator: function(value) {
    //     const self = this;
    //     self.funds_form.name = "";
    //     if (
    //       self.funds_form.submitted ||
    //       self.validation.isTouched("funds_form.u_id")
    //     ) {
    //       let validator = Validator.value(value)
    //         .required()
    //         .digit()
    //         .length(9);

    //       if (validator.hasImmediateError()) {
    //         return validator;
    //       } else {
    //         return validator.custom(() => {
    //           return self.$axios
    //             .post("/api/commission/user_id_check", {
    //               user_id: self.$store.state.user.data.user_id,
    //               recv_user_ans_id: value
    //             })
    //             .then(res => {
    //               if (res.data.data.count < 1) {
    //                 return "Invalid user id.";
    //               } else {
    //                 self.funds_form.name = res.data.data.full_name;
    //               }
    //             });
    //         });
    //       }
    //     }
    //   }
    // },
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
                self.$store.commit("member/setLoad_trans", true);
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
    .main-box .body .section .wallet-sc .amount {
      margin-top: 20px;

      span {
        &:not(.placeholder) {
          font-size: 18px;
        }
        &.placeholder {
          text-align: center !important;
          font-size: 25px !important;
        }
      }
    }
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


