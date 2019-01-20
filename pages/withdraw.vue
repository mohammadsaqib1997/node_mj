<template lang="pug">
    .fund-details
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Withdraw Amount
            .body
                .section
                  .columns
                    .column.is-6
                      .columns.is-gapless
                        .column.is-narrow
                          h2.title Wallet
                          .wallet-sc
                            img(src="~/assets/img/wallet.png")
                            .amount
                              span.placeholder Rs.
                              span {{ $store.state.member.wallet }}
                        .column
                          bankDetComp(:has_header="true")
                    .column.is-6
                      .box.bal-cont
                        table.table.is-fullwidth
                          thead
                            tr
                              th.has-text-centered(colspan='2')
                                | Finance
                          tbody
                            tr
                              td Available Balance:
                              td.has-text-right 0 PKR
                            tr
                              td Pending Balance:
                              td.has-text-right 0 PKR
                            tr
                              td Additional Fees:
                              td.has-text-right 0 PKR
                            tr
                              td
                                nuxt-link(to="/fund-manager/finance-details") Account Summary
                              
                  hr
                  template(v-if="form.loading !== true")
                    template(v-if="w_is_err === true")
                      h2.title Please Complete Your Profile And Bank Details
                      ul.errors
                        li.item(v-for="err in w_errors") {{ err.message }}

                    template(v-else)
                      b-message.cus-msg(type="is-danger" has-icon)
                        | You cannot withdraw any amount until shows in Available Balance.


                      //- form.form(v-else @submit.prevent="withdraw")
                      //-     .columns.is-variable.is-1
                      //-         .column.is-3
                      //-             label Withdraw Amount
                      //-         .column
                      //-             b-field(:type="(validation.hasError('form.amount')) ? 'is-danger':''" :message="validation.firstError('form.amount')")
                      //-                 b-input(type="text" placeholder="Enter Amount in Rupees" v-model="form.amount" v-mask="'#######'")
                      //-     .columns.is-variable.is-1
                      //-         .column.is-offset-3
                      //-             button.button.btn-des-1(type="submit" style="margin-top:0")
                      //-                 img(src="~/assets/img/transfer.png")
                      //-                 | &nbsp;&nbsp;&nbsp;&nbsp;Withdraw
                    b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
                    
</template>

<script>
import { mapState } from "vuex";
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
  computed: {
    ...mapState({
      w_is_err: state => state.profile.profile_comp.is_err,
      w_errors: state => state.profile.profile_comp.errors
    })
  },
  async mounted() {
    const self = this;
    this.form.loading = true;
    await this.$store.dispatch("member/loadWallet");
    await this.$store.dispatch("profile/mayWalletReq");
    this.form.loading = false;
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

<style lang="scss" scoped>
.fund-details /deep/ {
  .cus-msg {
    .media {
      align-items: center;
    }
  }
  .box.bal-cont {
    height: 100%;
    /deep/ {
      table.table {
        height: 100%;
        thead {
          th {
            text-transform: uppercase;
            font-size: 18px;
            font-weight: 500;
          }
        }
        td {
          vertical-align: middle;
          text-transform: uppercase;
          a {
            color: #d9bd68;
          }
        }
      }
    }
  }
}
ul.errors {
  li.item {
    font-size: 20px;
    font-weight: 300;
    color: #da367a;
    margin-bottom: 0.5rem;
    position: relative;
    padding-left: 20px;
    &:before {
      content: "";
      width: 10px;
      height: 10px;
      position: absolute;
      background-color: #da367a;
      border-radius: 100%;
      top: calc(50% - 5px);
      left: 0;
    }
  }
}
</style>

