<template lang="pug">
  section.section
    .container.main
      .columns
        .column.is-4
          h1.title-1 Sign Up
          p.txt-wrp Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          ul.status_items
            li.item(:class="{complete: cur_step > 0}")
              b Step 1:&nbsp;
              | User Details
            li.item(:class="{complete: cur_step > 1}")
              b Step 2:&nbsp;
              | Product Details
            li.item(:class="{complete: cur_step > 2}")
              b Step 3:&nbsp;
              | Activation
            li.item(:class="{complete: cur_step > 3}")
              b Step 4:&nbsp;
              | Confirmation
        #formSignUpCon.column.is-6.is-offset-1
          .tab-des-1
            .tab-header
              .columns.is-gapless
                .column(@click="tabActive(0)")
                  .t-card(:class="{active: (tab_header_ind === 0)}")
                    span Supreme Card
                .column(@click="tabActive(1)")
                  .t-bike(:class="{active: (tab_header_ind === 1)}")
                    span Motorcycle

            .tab-body
              .tab-content(:class="{active: this.cur_step === 1}")
                user-detail-form(ref="userDetForm")
              .tab-content(:class="{active: this.cur_step === 2}")
                template(v-if="tab_header_ind === 1")
                  bike-detail-form(ref="bikeDetForm")
                  hr
                product-detail-form(ref="prdDetForm")
              .tab-content(:class="{active: this.cur_step === 3}")
                .activation-con
                  .txt-content
                    | Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                  .img-heading
                    img(src="~/assets/img/checked.png")
                    h1 Activation - Process
              .tab-content(:class="{active: this.cur_step === 4}")
                .confirmation-con
                  .txt-content
                    | Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                  .img-heading
                    img(src="~/assets/img/checked.png")
                    h1 Signup - Completed

            .tab-footer(v-if="this.cur_step < 3")
              button.button.btn-des-1.dark(v-if="cur_step > 1" v-on:click="prev_step")
                b-icon(icon="angle-left" style="margin-top: 2px;")
                | &nbsp;&nbsp;Back to {{ steps_name[cur_step - 1] }}
              button.button.btn-des-1(v-on:click="next_step")
                | Continue to {{ steps_name[cur_step + 1] }}&nbsp;&nbsp;
                b-icon(icon="angle-right" style="margin-top: 2px;")
            b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
    termAndCondMD(:isSignup="true" :md_active="tc_md_active" @accept_terms_tr="accept_terms=$event;tc_md_active=false;next_step();")
</template>

<script>
import termAndCondMD from "~/components/modals/terms_and_cond.vue";
import userDetailForm from "~/components/forms/user_details.vue";
import productDetailForm from "~/components/forms/product_details.vue";
import bikeDetailForm from "~/components/forms/bike_details.vue";
export default {
  components: {
    userDetailForm,
    productDetailForm,
    bikeDetailForm,
    termAndCondMD
  },
  mounted() {
    const self = this;
    if (this.$route.query.token) {
      this.cur_step = 4;
    }
  },
  data() {
    return {
      form: {
        suc: "",
        err: "",
        loading: false
      },
      tab_header_ind: 0,
      cur_step: 1,
      steps_name: {
        1: "User Details",
        2: "Product Details",
        3: "Activation",
        4: "Confirmation"
      },
      tc_md_active: false,
      accept_terms: false
    };
  },
  methods: {
    tabActive: function(ind) {
      if (this.cur_step === 1) this.tab_header_ind = ind;
    },
    next_step: async function() {
      const self = this;
      self.$toast.open({
        duration: 3000,
        message: "Website is under maintenance. We will be back shortly.",
        position: "is-bottom",
        type: "is-info"
      });
      return;
      if (self.cur_step === 1) {
        await self.$refs.userDetForm.validate().then(result => {
          if (result) {
            self.cur_step++;
          }
        });
      } else if (self.cur_step === 2) {
        let check1 = true;
        if (self.tab_header_ind === 1) {
          check1 = await self.$refs.bikeDetForm.validate().then(result => {
            if (result) {
              return true;
            } else {
              return false;
            }
          });
        }
        let check2 = true;
        check2 = await self.$refs.prdDetForm.validate().then(result => {
          if (result) {
            return true;
          } else {
            return false;
          }
        });
        if (check1 && check2) {
          if (self.accept_terms === false) {
            self.tc_md_active = true;
            return;
          }
          let data_save = {
            member_data: {
              full_name: self.$refs.userDetForm.form.full_name,
              email: self.$refs.userDetForm.form.email,
              password: self.$refs.userDetForm.form.password,
              cnic_num: self.$refs.userDetForm.form.cnic_num,
              contact_num: self.$refs.userDetForm.form.cont_num,
              address: self.$refs.userDetForm.form.address,
              city: self.$refs.userDetForm.form.city,
              ref_user_asn_id:
                self.$refs.userDetForm.form.ref_code !== ""
                  ? self.$refs.userDetForm.form.ref_code
                  : null
            },
            bank_data: {
              bank_name: self.$refs.prdDetForm.form.bk_name,
              account_number: self.$refs.prdDetForm.form.acc_number,
              account_title: self.$refs.prdDetForm.form.acc_title,
              iban_number: self.$refs.prdDetForm.form.iban_num,
              branch_code: self.$refs.prdDetForm.form.br_code
            },
            prd_data: {
              product_id: self.tab_header_ind === 1 ? 2 : 1,
              buyer_type:
                self.tab_header_ind === 0
                  ? null
                  : self.$refs.bikeDetForm.form.sel_type,
              buyer_pay_type:
                self.tab_header_ind === 0
                  ? null
                  : self.$refs.bikeDetForm.form.pur_type,
              buyer_qty_prd:
                self.tab_header_ind === 0 ||
                self.$refs.bikeDetForm.form.sel_type !== 2
                  ? 0
                  : parseInt(self.$refs.bikeDetForm.form.num_of_bikes)
            }
          };

          self.form.loading = true;
          await self.$axios
            .post("/api/web/signup", data_save)
            .then(res => {
              if (res.data.status) {
                self.form.loading = false;
                self.cur_step++;
              } else {
                self.form.loading = false;
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
              self.form.loading = false;
              self.$snackbar.open({
                message: "Error: " + err.message,
                type: "is-danger",
                position: "is-bottom-right",
                actionText: "Cancel",
                queue: false
              });
            });
        }
      }
      self.animateDiv("#formSignUpCon");
    },
    prev_step: function() {
      if (this.cur_step > 1) this.cur_step--;
      this.animateDiv("#formSignUpCon");
    },
    animateDiv: function(divName) {
      $("html, body").animate({ scrollTop: $(divName).offset().top }, 500);
    }
  }
};
</script>

<style scoped lang="sass">
    .main
      color: #393e50
      .txt-wrp
        margin-top: 2rem
      .status_items
          margin-top: 2rem
          text-transform: uppercase
          font-size: 15px
          color: #828384
          .item
              position: relative
              padding-left: 35px
              padding-bottom: 50px
              &:first-child
                  &:before
                      content: none
              &:before
                  content: ' '
                  position: absolute
                  width: 1px
                  height: 100%
                  background-color: #dddfe0
                  left: 4.5px
                  bottom: calc(100% - 16px)
              &:after
                  content: ' '
                  position: absolute
                  width: 10px
                  height: 10px
                  background-color: #dddfe0
                  left: 0
                  top: 6px
                  border-radius: 100%

              &.complete
                  color: #2d2e30
                  &:after, &:before
                      background-color: #f3257f
      .tab-des-1
          min-height: 100%
          background-color: #feffff
          border-radius: 5px
          position: relative
          box-shadow: 0 1px 15px #ccc
          .tab-header
              text-align: center
              text-transform: uppercase
              color: #9197b8
              background-color: #3b3f58
              border-radius: 5px 5px 0 0
              .t-card, .t-bike
                  position: relative
                  padding: 35px
                  font-size: 14px
                  font-weight: bold
                  cursor: pointer
                  border-bottom: 2px solid #9197b8
                  &.active
                      border-bottom: 2px solid #d9bd68
                      color: #fff
                  &:before
                      content: ' '
                      display: block
                      width: 100%
                      height: 50px
                      background-repeat: no-repeat
                      background-position: center
                      background-size: contain
                      margin-bottom: 12px
              .t-card
                  &.active
                      &:before
                          background-image: url("/img/credit-card-active.png")
                  &:before
                      background-image: url("/img/credit-card.png")
              .t-bike
                  &.active
                      &:before
                          background-image: url("/img/motorcycle-active.png")
                  &:before
                      background-image: url("/img/motorcycle.png")
          .tab-body
              .tab-content
                display: none
                padding: 25px
                &.active
                  display: block
                .activation-con, .confirmation-con
                  h1
                    text-transform: uppercase
                    font-size: 2rem
                    font-weight: 300
                  @media screen and (min-width: 425px)
                    padding: 2rem
                    .img-heading
                      display: flex
                      justify-content: center
                      align-items: center
                      margin-top: 6rem
                      h1
                        margin: 0 1.5rem
                  @media screen and (max-width: 424px)
                    .img-heading
                      margin-top: 3rem
                      text-align: center
                      h1
                        margin: 1rem 0
          .tab-footer
            padding: 2rem
            text-align: center
</style>
