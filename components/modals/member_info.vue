<template>
  <b-modal class="member_info" :active.sync="modalAct" :canCancel="['outside']">
    <div class="box main-box">
      <div class="header">
        <h1>Member Information</h1>
      </div>
      <div class="body">
        <div class="section">

          <!-- here is loaded data -->
          <template v-if="loading !== true">
            <div class="mem-info-con">
              <div class="detail status">
                <h1 class="title is-4">Status</h1>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Level</label></div>
                  <div class="column">
                    <h2>{{ mem_info.level }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Wallet</label></div>
                  <div class="column">
                    <h2>{{ mem_info.wallet }}/-</h2>
                  </div>
                </div>
              </div>
              <div class="detail account">
                <h1 class="title is-4">Account</h1>
                <div class="columns is-variable is-1">
                  <div class="column"><label>ID</label></div>
                  <div class="column">
                    <h2>{{ mem_info.user_asn_id }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Full Name</label></div>
                  <div class="column">
                    <h2>{{ mem_info.full_name }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Date Of Birth</label></div>
                  <div class="column">
                    <h2>{{ mem_info.dob ? $store.getters.formatDate(mem_info.dob) : '' }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>CNIC</label></div>
                  <div class="column">
                    <h2>{{ mem_info.cnic_num }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Email</label></div>
                  <div class="column">
                    <h2>{{ mem_info.email }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Contact Number</label></div>
                  <div class="column">
                    <h2>{{ mem_info.contact_num }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Address</label></div>
                  <div class="column">
                    <h2>{{ mem_info.address }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>City</label></div>
                  <div class="column">
                    <h2>{{ mem_info.city }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Referral ID</label></div>
                  <div class="column">
                    <h2>{{ mem_info.ref_user_asn_id }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Status</label></div>
                  <div class="column">
                    <h2>{{ (mem_info.active_sts == 1) ? "Approved":"Suspended" }}</h2>
                  </div>
                </div>
              </div>
              <div class="detail prd">
                <h1 class="title is-4">Product Detail</h1>
                <div class="columns is-variable is-1">
                  <div class="column is-6"><label>Product Selected</label></div>
                  <div class="column is-6">
                    <div class="img-cont">
                      <img v-if="mem_info.product_id && mem_info.product_id === 1" src="~/assets/img/credit-card-active.png" />
                      <img v-else-if="mem_info.product_id && mem_info.product_id === 2" src="~/assets/img/motorcycle-active.png" />
                    </div>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column is-6"><label>Product Name</label></div>
                  <div class="column is-6">
                    <h2 v-if="mem_info.product_id && mem_info.product_id === 1">Supreme Card</h2>
                    <h2 v-else-if="mem_info.product_id && mem_info.product_id === 2">Motorcycle</h2>
                  </div>
                </div>
                <template v-if="mem_info.product_id && mem_info.product_id === 2">
                  <div class="columns is-variable is-1">
                    <div class="column is-6"><label>Buyer Type</label></div>
                    <div class="column is-6">
                      <h2 v-if="mem_info.buyer_type && mem_info.buyer_type === 1">Individual</h2>
                      <h2 v-else-if="mem_info.buyer_type && mem_info.buyer_type === 2">Reseller</h2>
                    </div>
                  </div>
                  <template v-if="mem_info.buyer_type && mem_info.buyer_type === 2">
                    <div class="columns is-variable is-1">
                      <div class="column is-6"><label>Quantity Of Bikes</label></div>
                      <div class="column is-6">
                        <h2 v-if="mem_info.buyer_qty_prd">{{ mem_info.buyer_qty_prd }}</h2>
                      </div>
                    </div>
                  </template>
                  <div class="columns is-variable is-1">
                    <div class="column is-6"><label>Payment Type</label></div>
                    <div class="column is-6">
                      <h2 v-if="mem_info.buyer_pay_type && mem_info.buyer_pay_type === 1">On Cash</h2>
                      <h2 v-else-if="mem_info.buyer_pay_type && mem_info.buyer_pay_type === 2">On Installment</h2>
                    </div>
                  </div>
                </template>
                <div class="columns is-variable is-1">
                  <div class="column is-6"><label>Package Activation</label></div>
                  <div class="column is-6">
                    <h2 v-if="mem_info.package_act_date">
                      Start: {{ gen_date(mem_info.package_act_date, 0) }}
                      <br />
                      End: {{ gen_date(mem_info.package_act_date, 1) }}
                    </h2>
                  </div>
                </div>

              </div>
              <div class="detail bank">
                <h1 class="title is-4">Bank Detail</h1>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Bank Name</label></div>
                  <div class="column">
                    <h2>{{ mem_info.bank_name }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Branch Code</label></div>
                  <div class="column">
                    <h2>{{ mem_info.branch_code }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Account Title</label></div>
                  <div class="column">
                    <h2>{{ mem_info.account_title }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Account Number</label></div>
                  <div class="column">
                    <h2>{{ mem_info.account_number }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>IBAN</label></div>
                  <div class="column">
                    <h2>{{ mem_info.iban_number }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Address</label></div>
                  <div class="column">
                    <h2>{{ mem_info.bk_address }}</h2>
                  </div>
                </div>
              </div>
            </div>
            <b-field class="has-text-centered">
              <button class="button btn-des-1 dark" @click="modalAct=false;">Close</button>
            </b-field>
          </template>

          <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
  import moment from "moment";
  import mxn_modal from "~/mixins/modal.js";
  export default {
    mixins: [mxn_modal],
    props: {
      mem_id: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        loading: true,
        mem_info: {}
      };
    },
    methods: {
      gen_date: function (str, addYear) {
        return moment(new Date(str))
          .add(addYear, "year")
          .format("DD MMM YYYY");
      },
      async loadData() {
        const self = this;
        self.loading = true;
        await self.$axios
          .get("/api/member/member_info/" + self.mem_id)
          .then(res => {
            self.mem_info = res.data.result;
          })
          .catch(err => {
            console.log(err);
          });
        self.loading = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .member_info /deep/ {
    .section {
      min-height: 200px;

      .mem-info-con {
        >.detail {
          margin-bottom: 1rem;

          >.columns {
            margin-bottom: 0.7rem;
            border-bottom: 1px solid #f1f1f1;

            >.column {
              padding-top: 0.5rem;
              padding-bottom: 0.5rem;
            }
          }
        }

        label {
          font-weight: 300;
          line-height: normal;
          font-size: 1.2rem;
        }

        h2 {
          font-weight: bold;
          line-height: normal;
          font-size: 1.2rem;
          color: #3d3e5a;
        }
      }
    }
  }
</style>