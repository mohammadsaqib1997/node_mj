<template lang="pug">
  section.section
    .container.main
      .columns
        .column.is-4
          h1.title-1 Sign Up
          p.txt-wrp Still not a member? Join us now and get access to all the benefits. As a member you'll have the opportunity to earn the rewards from our auto system or campaign system. Other than that, you can get discounts on hundreds of outlets in different cities. Harvest your earnings and shape your future!

        #formSignUpCon.column.is-6.is-offset-1
          form.tab-des-1(@submit.prevent="signup")
            .tab-header
              .columns.is-gapless
                .column(@click="tabActive(1)")
                  .t-card(:class="{active: (tab_header_ind === 1)}")
                    span SIDC Card
                .column(@click="tabActive(2)")
                  .t-card(:class="{active: (tab_header_ind === 2)}")
                    span SIDC + Insurance Card

            .tab-body
              .tab-content(:class="{active: this.cur_step === 1}")
                user-detail-form(ref="userDetForm")

            .tab-footer
              p.discount-txt(v-if="tab_header_ind === 2 && isPromotion")
                | Promotion 10000 PKR - 20% = 8000 PKR
                br
                | This promotion will expire by the end of 21st January 2019.
              b-field
                p.control.has-text-centered
                  button.button.btn-des-1(type="submit") SignUp
            b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
    termAndCondMD(:isSignup="true" :md_active="tc_md_active" @accept_terms_tr="accept_terms=$event;tc_md_active=false;signup();")
</template>

<script>
import termAndCondMD from "~/components/modals/terms_and_cond.vue";
import userDetailForm from "~/components/forms/user_details.vue";
import { DateTime } from "luxon";
import moment from "moment";
export default {
  head: {
    script: [
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=UA-131367350-1"
      }
    ]
  },
  mounted() {
    const self = this;
    self.$nextTick(function() {
      self.promotionCheck();
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());

      gtag("config", "UA-131367350-1");
    });
  },
  components: {
    userDetailForm,
    termAndCondMD
  },
  data() {
    return {
      form: {
        suc: "",
        err: "",
        loading: false
      },
      timeoutInterval: null,
      isPromotion: false,
      prom_start_date: DateTime.local()
        .setZone("UTC+5")
        .set({
          year: 2019,
          month: 1,
          day: 20,
          hour: 0,
          minute: 0,
          second: 0
        })
        .toString(),
      prom_end_date: DateTime.local()
        .setZone("UTC+5")
        .set({
          year: 2019,
          month: 1,
          day: 21,
          hour: 23,
          minute: 59,
          second: 59
        })
        .toString(),
      tab_header_ind: 1,
      cur_step: 1,
      tc_md_active: false,
      accept_terms: false
    };
  },
  destroyed() {
    clearTimeout(this.timeoutInterval);
  },
  methods: {
    promotionCheck() {
      const self = this;
      let curr_dt = DateTime.local()
        .setZone("UTC+5")
        .toString();
      self.isPromotion = moment(curr_dt).isBetween(
        self.prom_start_date,
        self.prom_end_date
      );
      self.timeoutInterval = setTimeout(self.promotionCheck, 1000);
    },
    tabActive: function(ind) {
      if (this.cur_step === 1) this.tab_header_ind = ind;
    },
    async signup() {
      const self = this;
      self.form.loading = true;
      let form_data = await self.$refs.userDetForm.validate().then(result => {
        if (result) {
          return result;
        } else {
          return false;
        }
      });
      if (form_data) {
        form_data["sel_prd"] = self.tab_header_ind;
        if (self.accept_terms === false) {
          self.tc_md_active = true;
          return;
        }
        await self.$axios
          .post("/api/web/signup", {
            member_data: {
              full_name: form_data.full_name,
              email: form_data.email,
              password: form_data.password,
              contact_num: form_data.cont_num,
              address: form_data.address,
              ref_user_asn_id:
                form_data.ref_code !== "" ? form_data.ref_code : null
            },
            ext_data: {
              prd_id: form_data.sel_prd,
              crct: form_data.sel_crct_id,
              brn_id: form_data.sel_brn_id,
              promotion: self.isPromotion
            }
          })
          .then(res => {
            if (res.data.status) {
              self.$store.dispatch("login", {
                token: res.data.token,
                data: res.data.user
              });
              self.$router.push("/dashboard");
            } else {
              self.$snackbar.open({
                message: "Error: " + res.data.message,
                type: "is-danger",
                position: "is-bottom-right",
                actionText: "Cancel",
                queue: false
              });
            }
          })
          .catch(err => {
            self.$snackbar.open({
              message: "Error: " + err.message,
              type: "is-danger",
              position: "is-bottom-right",
              actionText: "Cancel",
              queue: false
            });
            self.animateDiv("#formSignUpCon");
          });
      }
      self.form.loading = false;
      self.animateDiv("#formSignUpCon");
    },
    animateDiv: function(divName) {
      $("html, body").animate({ scrollTop: $(divName).offset().top }, 500);
    }
  }
};
</script>

<style scoped lang="scss">
.main {
  color: #393e50;
  .txt-wrp {
    margin-top: 2rem;
  }
  .status_items {
    margin-top: 2rem;
    text-transform: uppercase;
    font-size: 15px;
    color: #828384;
    .item {
      position: relative;
      padding-left: 35px;
      padding-bottom: 50px;
      &:first-child {
        &:before {
          content: none;
        }
      }
      &:before {
        content: " ";
        position: absolute;
        width: 1px;
        height: 100%;
        background-color: #dddfe0;
        left: 4.5px;
        bottom: calc(100% - 16px);
      }
      &:after {
        content: " ";
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #dddfe0;
        left: 0;
        top: 6px;
        border-radius: 100%;
      }
      &.complete {
        color: #2d2e30;
        &:after,
        &:before {
          background-color: #f3257f;
        }
      }
    }
  }
  .tab-des-1 {
    min-height: 100%;
    background-color: #feffff;
    border-radius: 5px;
    position: relative;
    box-shadow: 0 1px 15px #cccccc;
    .tab-header {
      text-align: center;
      text-transform: uppercase;
      color: #9197b8;
      background-color: #3b3f58;
      border-radius: 5px 5px 0 0;
      .t-card {
        position: relative;
        height: 100%;
        padding: 35px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        border-bottom: 2px solid #9197b8;
        &.active {
          border-bottom: 2px solid #d9bd68;
          color: white;
        }
        &:before {
          content: " ";
          display: block;
          width: 100%;
          height: 50px;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          margin-bottom: 12px;
        }
      }
      .t-card {
        &.active {
          &:before {
            background-image: url("/img/credit-card-active.png");
          }
        }
        &:before {
          background-image: url("/img/credit-card.png");
        }
      }
    }
    .tab-body {
      .tab-content {
        display: none;
        padding: 25px;
        &.active {
          display: block;
        }
        .activation-con,
        .confirmation-con {
          .txt-content {
            font-size: 24px;
            font-weight: 300;
            text-align: justify;
          }
          h1 {
            text-transform: uppercase;
            font-size: 2rem;
            font-weight: 300;
          }
          @media screen and (min-width: 425px) {
            padding: 2rem;
            .img-heading {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 6rem;
              h1 {
                margin: 0 1.5rem;
              }
            }
          }
          @media screen and (max-width: 424px) {
            .img-heading {
              margin-top: 3rem;
              text-align: center;
              h1 {
                margin: 1rem 0;
              }
            }
          }
        }
      }
    }
    .tab-footer {
      padding: 2rem;
      text-align: center;
      .discount-txt {
        margin-bottom: 1rem;
        font-weight: 100;
        font-size: 20px;
        color: #47ab15;
      }
      .btn-des-1 {
        max-width: 100%;
        white-space: pre-wrap;
        font-size: 18px;
        letter-spacing: 0.5px;
      }
    }
  }
}
</style>
