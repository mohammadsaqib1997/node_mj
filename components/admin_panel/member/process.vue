<template>
  <div class="process">
    <div class="main-cont columns is-gapless is-multiline">
      <h2 class="column is-12">Progress</h2>
      <article :class="['column', { 'complete': comp_item[0] == true }]">
        <i class="fas fa-sign-in-alt"></i>
        <h3>Sign Up</h3>
      </article>
      <article :class="['column', { 'complete': comp_item[1] == true }]" @click="payment_md_click">
        <i class="far fa-money-bill-alt"></i>
        <h3>Payment</h3>
      </article>
      <article :class="['column', { 'complete': comp_item[2] == true }]">
        <i class="fas fa-unlock-alt"></i>
        <h3>Activation</h3>
      </article>
      <article :class="['column', { 'complete': prof_prog_check == true }]" @click="prf_md_click">
        <i class="far fa-list-alt"></i>
        <h3>Profile Completion</h3>
      </article>
      <article :class="['column', { 'complete': comp_item[4] == true }]">
        <i class="fas fa-door-open"></i>
        <h3>Welcome</h3>
      </article>
    </div>
    <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
    <b-modal class="profile-md" :active.sync="md_profile" :canCancel="['x']">
      <div class="box main-box">
        <div class="header">
          <h1>Porfile Completion</h1>
        </div>
        <div class="body">
          <div class="section">
            <ul class="incomplete">
              <li v-for="(item, ind) in incomp_p_list" :key="ind">{{ item }}</li>
            </ul>
            <b-field grouped>
              <p class="control">
                <nuxt-link to="/user/profile" class="button btn-des-1">Edit Profile</nuxt-link>
              </p>
              <p class="control">
                <nuxt-link to="/user/bank-details" class="button btn-des-1">Edit Bank Details</nuxt-link>
              </p>
            </b-field>
          </div>
        </div>
      </div>
    </b-modal>
    <b-modal class="payment-md" :active.sync="md_payment" :canCancel="['x']">
      <div class="box main-box">
        <div class="header">
          <h1>Payable Amount: {{ prof_comp_field.prd_reg_amount }}/-</h1>
        </div>
        <div class="body">
          <div class="section panel-cont">
            <div class="cus-collapse">
              <div class="header" @click="collapse_opne_ind=0">
                <img src="~/assets/img/payment_opt/MeezanBank.png">
                Bank
              </div>
              <div class="body-content" :style="{'display': collapse_opne_ind === 0 ? 'block': ''}">
                <p>
                  <b>Name:</b> Syed Javaid Hassan
                  <br>
                  <b>Bank:</b> Meezan Bank Ltd.
                  <br>
                  <b>Account Number:</b> 01040100202501
                </p>
                <br>
                <p>
                  <b>Note:</b> After transferring the amount, whats the receipt using whatsapp messenger on below right of your screen or email us the invoice at : info@mj-supreme.com. It may take 24 to 48 hours to activate upon approval.
                </p>
              </div>
            </div>
            <div class="cus-collapse">
              <div class="header" @click="collapse_opne_ind=1">
                <img src="~/assets/img/payment_opt/jazzCash.png">
                Jazz Cash
              </div>
              <div class="body-content" :style="{'display': collapse_opne_ind === 1 ? 'block': ''}">
                <p>
                  <b>Name:</b> Syed Javaid Hassan
                  <br>
                  <b>Number:</b> 03008232618
                </p>
                <br>
                <p>
                  <b>Note:</b> After transferring the amount, whats the receipt using whatsapp messenger on below right of your screen or email us the invoice at : info@mj-supreme.com. It may take 24 to 48 hours to activate upon approval.
                </p>
              </div>
            </div>
            <div class="cus-collapse">
              <div class="header" @click="collapse_opne_ind=2">
                <img src="~/assets/img/payment_opt/easyPaisa.png">
                Easy Paisa
              </div>
              <div class="body-content" :style="{'display': collapse_opne_ind === 2 ? 'block': ''}">
                <p>
                  <b>Name:</b> Syed Javaid Hassan
                  <br>
                  <b>Number:</b> 03008232618
                </p>
                <br>
                <p>
                  <b>Note:</b> After transferring the amount, whats the receipt using whatsapp messenger on below right of your screen or email us the invoice at : info@mj-supreme.com. It may take 24 to 48 hours to activate upon approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  async mounted() {
    this.loading = true;
    await this.getProfileSts();
    this.loading = false;
  },
  data() {
    return {
      loading: true,
      comp_item: [false, false, false, false, false],
      md_profile: false,
      md_payment: false,
      prof_comp_field: {},
      incomp_p_list: [],
      collapse_opne_ind: 0
    };
  },
  computed: {
    prof_prog_check() {
      let bool = false;
      if (Object.keys(this.prof_comp_field).length > 0) {
        bool = true;
        _.each(this.prof_comp_field, (item, key) => {
          if (key === "is_paid_m" || key === "prd_reg_amount") {
            return;
          }
          if (item === null || item === "") {
            bool = false;
            return false;
          }
        });
      }
      return bool;
    }
  },
  methods: {
    async getProfileSts() {
      const self = this;
      self.$axios
        .get("/api/profile/get-process-detail")
        .then(res => {
          self.$set(self.comp_item, 0, true);
          let profile_field = {};
          _.each(res.data.result, (item, key) => {
            if (key == "cnic_num" && (item === null || item === "")) {
              self.incomp_p_list.push("Add CNIC Number in profile.");
            }
            if (key == "dob" && (item === null || item === "")) {
              self.incomp_p_list.push("Add Date Of Birth in profile.");
            }
            if (key == "address" && (item === null || item === "")) {
              self.incomp_p_list.push("Add Mailing Address in profile.");
            }
            if (key == "account_number" && (item === null || item === "")) {
              self.incomp_p_list.push("Add Account Number in bank detials.");
            }
            if (key == "account_title" && (item === null || item === "")) {
              self.incomp_p_list.push("Add Account Title in bank detials.");
            }
            if (key == "bank_name" && (item === null || item === "")) {
              self.incomp_p_list.push("Add Bank Name in bank detials.");
            }
            if (key == "branch_code" && (item === null || item === "")) {
              self.incomp_p_list.push("Add Branch Code in bank detials.");
            }
            profile_field[key] = item;
          });
          self.prof_comp_field = profile_field;
        })
        .catch(err => {
          console.log(err);
        });
    },
    prf_md_click() {
      if (this.prof_prog_check !== true) {
        this.md_profile = true;
      }
    },
    payment_md_click() {
      this.md_payment = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.process {
  position: relative;
  /deep/ {
    .main-cont {
      > h2.column {
        padding: 15px !important;
        text-align: center;
        font-size: 24px;
        text-transform: uppercase;
        background-color: #3d3e5a;
        color: white;
        border-radius: 8px 8px 0 0;
        margin-bottom: 2px;
      }

      @media screen and (min-width: 769px) {
        > :nth-child(2) {
          margin-left: 0 !important;
        }
      }

      > article.column {
        text-align: center;
        background-color: #58597b;
        color: white;
        @media screen and (min-width: 769px) {
          margin-left: 1px;
          margin-right: 1px;
          &:last-child {
            margin-right: 0;
          }
        }
        &.complete {
          opacity: 0.5;
        }
        &:not(.complete) {
          cursor: pointer;
        }

        > i {
          font-size: 3rem;
          display: block;
          padding: 1.8rem;
          background-color: #f7dc8b;
          color: #3d3e5a;
        }
        > h3 {
          padding: 5px;
          font-size: 20px;
          text-transform: uppercase;
        }
      }
    }

    .profile-md {
      ul.incomplete {
        list-style: disc;
        margin-left: 18px;
        color: #e26262;
        li {
          font-size: 20px;
          font-weight: 300;
          margin-bottom: 1rem;
        }
      }
    }
    .payment-md {
      .cus-collapse {
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 1px 10px 0px #d0d0d0;
        margin-bottom: 1rem;
        .header {
          cursor: pointer;
          background-color: #f7dc8b;
          font-size: 20px;
          padding: 10px 20px;
          font-weight: 500;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          img {
            margin-right: 1rem;
          }
        }
        .body-content {
          display: none;
          padding: 10px 15px 15px;
          background-color: #fff2cc;
          color: #6d6d6d;
        }
      }
    }
  }
}
</style>

