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
                  <div class="column"><label>Auto Level</label></div>
                  <div class="column">
                    <h2>{{ getLvlRwd(0, mem_info.level, 'lvl') }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Self Level</label></div>
                  <div class="column">
                    <h2>{{ getSelfLevel(parseInt(mem_info.direct_ref)+parseInt(mem_info.indirect_ref)) }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Wallet</label></div>
                  <div class="column">
                    <h2>{{ mem_info.wallet }}/-</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Direct Referrals</label></div>
                  <div class="column">
                    <h2>{{ mem_info.direct_ref }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>In-Direct Referrals</label></div>
                  <div class="column">
                    <h2>{{ mem_info.indirect_ref }}</h2>
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
                  <div class="column"><label>Mailing Address</label></div>
                  <div class="column">
                    <h2>{{ mem_info.address }}</h2>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column"><label>Branch</label></div>
                  <div class="column">
                    <h2>{{ mem_info.crzb_name }}</h2>
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
                      <img src="~/assets/img/credit-card-active.png" />
                    </div>
                  </div>
                </div>
                <div class="columns is-variable is-1">
                  <div class="column is-6"><label>Product Name</label></div>
                  <div class="column is-6">
                    <h2>{{ mem_info.product_name }}</h2>
                  </div>
                </div>
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
            <b-field class="btns-cont">
              <button class="button btn-des-1" @click.prevent="exportData">Export To Excel</button>
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
import mxn_rewardsData from "~/mixins/rewards-data.js";
export default {
  mixins: [mxn_modal, mxn_rewardsData],
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
    gen_date: function(str, addYear) {
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
    },
    async exportData() {
      const self = this;
      self.loading = true;
      let mem_info = self.mem_info;
      let send_data = [
        { name: "Status", value: "" },
        { name: "Auto Level", value: self.getLvlRwd(0, mem_info.level, "lvl") },
        {
          name: "Self Level",
          value: self.getSelfLevel(
            parseInt(mem_info.direct_ref) + parseInt(mem_info.indirect_ref)
          )
        },
        {
          name: "Wallet",
          value: (mem_info.wallet ? mem_info.wallet : "0") + "/-"
        },
        { name: "Direct Referrals", value: mem_info.direct_ref },
        { name: "In-Direct Referrals", value: mem_info.indirect_ref },
        { name: "Account", value: "" },
        { name: "ID", value: mem_info.user_asn_id },
        { name: "Full Name", value: mem_info.full_name },
        {
          name: "Date Of Birth",
          value: mem_info.dob
            ? self.$store.getters.formatDate(mem_info.dob)
            : ""
        },
        { name: "CNIC", value: mem_info.cnic_num },
        { name: "Email", value: mem_info.email },
        { name: "Contact Number", value: mem_info.contact_num },
        { name: "Address", value: mem_info.address },
        { name: "Branch", value: mem_info.crzb_name },
        { name: "Referral ID", value: mem_info.ref_user_asn_id },
        {
          name: "Status",
          value: mem_info.active_sts == 1 ? "Approved" : "Suspended"
        },
        { name: "Product Detail", value: "" },
        {
          name: "Product Name",
          value: mem_info.product_name
        }
      ];

      send_data.push(
        {
          name: "Package Activation",
          value: mem_info.package_act_date
            ? `Start: ${self.gen_date(
                mem_info.package_act_date,
                0
              )} TO End: ${self.gen_date(mem_info.package_act_date, 1)}`
            : ""
        },
        { name: "Bank Detail", value: "" },
        { name: "Bank Name", value: mem_info.bank_name },
        { name: "Branch Code", value: mem_info.branch_code },
        { name: "Account Title", value: mem_info.account_title },
        { name: "Account Number", value: mem_info.account_number },
        { name: "IBAN", value: mem_info.iban_number },
        { name: "Address", value: mem_info.bk_address }
      );
      await self
        .$axios({
          url: "/api/gen_excel/export_member_info/",
          method: "POST",
          data: send_data,
          responseType: "blob"
        })
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          let link = document.getElementById("download_anc");
          if (!link) {
            link = document.createElement("a");
            link.id = "download_anc";
          }
          link.href = url;
          link.setAttribute(
            "download",
            `info_export_${self.mem_info.full_name}.csv`
          );
          if (!document.getElementById("download_anc")) {
            document.body.appendChild(link);
          }
          link.click();
          let el = document.getElementById("download_anc");
          el.parentNode.removeChild(el);
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
      > .detail {
        margin-bottom: 1rem;

        > .columns {
          margin-bottom: 0.7rem;
          border-bottom: 1px solid #f1f1f1;

          > .column {
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

    .btns-cont {
      justify-content: center;
      & > .btn-des-1:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
}
</style>