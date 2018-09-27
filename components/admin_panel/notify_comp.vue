<template lang="pug">
  b-modal(:active="mdActive" :canCancel="false")
    .box.main-box
      .header.columns.is-gapless
        .column
            h1(v-if="a_item.type === 0") Notify
            h1(v-else-if="a_item.type === 1") Confirmation
            h1(v-else-if="a_item.type === 2") Withdrawal Request
            h1(v-else-if="a_item.type === 3") Claim Request
            h1(v-else) Notify
      .body
        .section
          //- here is simple message
          .show-info
            label {{ a_item.msg }}
            
          //- here is loaded content
          .load-content(v-if="(a_item.type === 1 || a_item.type === 3) && a_item.hasOwnProperty('data') && loading !== true")
            hr
            template(v-if="a_item.type === 1")
              h3.title Member
              .columns.is-gapless
                .column.is-4
                  label Name
                .column
                  h3 {{ a_item.data['name'] }}
              .columns.is-gapless
                .column.is-4
                  label Email
                .column
                  h3 {{ a_item.data['email'] }}
              .columns.is-gapless
                .column.is-4
                  label Contact Number
                .column
                  h3 {{ a_item.data['cont_num'] }}
              .columns.is-gapless(v-if="a_item.data.paid === 1")
                .column.is-4
                  label Paid Member

            template(v-if="a_item.type === 3")
              h3.title Reward Info
              .columns.is-gapless.rwds_load_content
                .column.is-5
                  label Select Reward Type:
                .column
                  h3 {{ lvl_rwds[a_item.data.lvl][a_item.data.type].title }}
                  span.icon(v-html="lvl_rwds[a_item.data.lvl][a_item.data.type].icon")

          //- here is footer
          template(v-if="a_item.type === 0")
            button.button.btn-des-1(@click.prevent="$store.commit('notification/modalActTG', false)")
              | Ok

          template(v-else-if="a_item.type === 1")
            template(v-if="loading !== true")
              template(v-if="a_item.hasOwnProperty('data') && a_item.data.paid === 0")
                button.button.btn-des-1(@click.prevent="$store.commit('notification/modalActTG', false)")
                  | Close
                button.button.btn-des-1(@click.prevent="payUser(a_item.from_id)" style="margin-left:10px")
                  | Pay
              button.button.btn-des-1(v-else @click.prevent="$store.commit('notification/modalActTG', false)")
                | Ok

          template(v-else-if="a_item.type === 2 && a_item.hasOwnProperty('data') && loading !== true")
            h4.title.is-5(v-if="a_item.data.status !== 0" style="margin-bottom:.5rem;") {{ a_item.data.status === 1 ? "Already Paid": "Canceled Request" }}
            .level
              .level-left(v-if="a_item.data.status === 0")
                button.button.btn-des-1(@click.prevent="ch_sts(a_item.data.id, 2)")
                  | Cancel
                button.button.btn-des-1(@click.prevent="ch_sts(a_item.data.id, 1)" style="margin-left:10px")
                  | Pay
              .level-right
                button.button.btn-des-1(@click.prevent="$store.commit('notification/modalActTG', false)")
                  | Close

          template(v-else-if="a_item.type === 3 && a_item.hasOwnProperty('data') && loading !== true")
            h4.title.is-5(v-if="a_item.data.status !== 0" style="margin-bottom:.5rem;") {{ a_item.data.status === 1 ? "Already Claim": "Canceled Claim" }}
            .level
              .level-left(v-if="a_item.data.status === 0 && date_gt(a_item.data.clm_date, a_item.date) === 0")
                b-field.cancel_rs_fld(v-if="cancel_fm.is === true")
                  b-input(placeholder="Cancel Reason" v-model="cancel_fm.msg" expanded)
                  p.control
                    button.button.is-primary.btn-des-1(@click.prevent="claim_ch_sts(a_item.data.mem_id, a_item.data.lvl, 2)") Cancel
                template(v-else)
                  button.button.btn-des-1(@click.prevent="cancel_fm.is=true;")
                    | Cancel
                  button.button.btn-des-1(@click.prevent="claim_ch_sts(a_item.data.mem_id, a_item.data.lvl, 1)" style="margin-left:10px")
                    | Accept
              .level-right
                button.button.btn-des-1(@click.prevent="$store.commit('notification/modalActTG', false)")
                  | Close

          template(v-else)
            button.button.btn-des-1(@click.prevent="$store.commit('notification/modalActTG', false)")
              | Close
          b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
import moment from "moment";
export default {
  watch: {
    mdActive: function(val) {
      if (val === false) {
        this.cancel_fm = {
          is: false,
          msg: ""
        };
      }
    }
  },
  computed: {
    a_item: function() {
      return this.$store.state.notification.a_item;
    },
    loading: function() {
      return this.$store.state.notification.load_data;
    },
    mdActive: function() {
      return this.$store.state.notification.modalAct;
    }
  },
  data() {
    return {
      cancel_fm: {
        is: false,
        msg: ""
      },
      lvl_rwds: {
        "3": [
          {
            title: "Laptop",
            icon: '<i class="fas fa-laptop"></i>'
          },
          {
            title: "Rs. 25,000/-",
            icon: '<i class="fas fa-money-bill-alt"></i>'
          }
        ],
        "4": [
          {
            title: "Mobile",
            icon: '<i class="fas fa-mobile-alt"></i>'
          },
          {
            title: "Rs. 50,000/-",
            icon: '<i class="fas fa-money-bill-alt"></i>'
          }
        ],
        "5": [
          {
            title: "CG-125 Motorcycle",
            icon: '<i class="fas fa-motorcycle"></i>'
          },
          {
            title: "Rs. 100,000/-",
            icon: '<i class="fas fa-money-bill-alt"></i>'
          }
        ],
        "6": [
          {
            title: "Ummrah With Dubai Tour",
            icon: '<i class="fas fa-ticket-alt"></i>'
          },
          {
            title: "Rs. 200,000/-",
            icon: '<i class="fas fa-money-bill-alt"></i>'
          }
        ],
        "7": [
          {
            title: "Malaysia Tour",
            icon: '<i class="fas fa-ticket-alt"></i>'
          },
          {
            title: "Rs. 300,000/-",
            icon: '<i class="fas fa-money-bill-alt"></i>'
          }
        ],
        "8": [
          {
            title: "Gli New Model Current Year",
            icon: '<i class="fas fa-car"></i>'
          },
          {
            title: "$. 18,000/-",
            icon: '<i class="fas fa-money-bill-alt"></i>'
          }
        ],
        "9": [
          {
            title: "Toyota Fortuner 2018",
            icon: '<i class="fas fa-shuttle-van"></i>'
          },
          {
            title: "$. 50,000/-",
            icon: '<i class="fas fa-money-bill-alt"></i>'
          }
        ]
      }
    };
  },
  methods: {
    payUser: async function(id) {
      const self = this;
      let is_err = false;
      let msg = "";
      self.$store.commit("notification/set_loader", true);
      await self.$axios
        .post("/api/member/pay_user", { id })
        .then(res => {
          if (res.data.status === true) {
            let set_a_item = self.a_item;
            set_a_item["data"]["paid"] = 1;
            self.$store.commit("notification/set_active_item", set_a_item);
            msg = "Successfully Paid Member.";
          } else {
            is_err = true;
            msg = "Server Error!";
          }
        })
        .catch(err => {
          is_err = true;
          msg = "Error: " + err.message;
        });
      self.$store.commit("notification/set_loader", false);
      self.$toast.open({
        duration: 3000,
        message: msg,
        position: "is-bottom",
        type: is_err === true ? "is-danger" : "is-success"
      });
    },
    ch_sts: async function(id, type) {
      const self = this;
      let is_err = false;
      let msg = "";
      self.$store.commit("notification/set_loader", true);
      await self.$axios
        .post("/api/commission/set_sts", {
          id,
          type
        })
        .then(async res => {
          if (res.data.status === true) {
            let set_a_item = self.a_item;
            set_a_item["data"]["status"] = type;
            self.$store.commit("notification/set_active_item", set_a_item);
            msg = `Successfully Request ${type === 1 ? "Approve" : "Cancel"}.`;
          } else {
            is_err = true;
            msg = res.data.message;
          }
        })
        .catch(err => {
          is_err = true;
          msg = err.message;
          console.log(err);
        });
      self.$store.commit("notification/set_loader", false);
      self.$toast.open({
        duration: 3000,
        message: msg,
        position: "is-bottom",
        type: is_err === true ? "is-danger" : "is-success"
      });
    },
    claim_ch_sts: async function(mem_id, lvl, sts) {
      const self = this;
      let is_err = false;
      let msg = "";
      self.$store.commit("notification/set_loader", true);
      await self.$axios
        .post("/api/reward/sts_change", {
          mem_id,
          lvl,
          sts,
          reason: self.cancel_fm.msg
        })
        .then(res => {
          if (res.data.status === true) {
            let set_a_item = self.a_item;
            set_a_item["data"]["status"] = sts;
            self.$store.commit("notification/set_active_item", set_a_item);
            msg = `Successfully Request ${
              sts === 1 ? "Accepted" : "Canceled"
            }.`;
          } else {
            is_err = true;
            msg = res.data.message;
          }
        })
        .catch(err => {
          is_err = true;
          msg = err.message;
          console.log(err);
        });
      self.$store.commit("notification/set_loader", false);
      self.$toast.open({
        duration: 3000,
        message: msg,
        position: "is-bottom",
        type: is_err === true ? "is-danger" : "is-success"
      });
    },
    date_gt(clm_date, notify_date) {
      let a = moment(clm_date),
        b = moment(notify_date);

      return a.diff(b, "seconds");
    }
  }
};
</script>

<style lang="scss" scoped>
.load-content {
  margin: 10px 0;
  .title {
    font-size: 30px;
    font-weight: 300;
    margin-bottom: 10px;
  }
  label,
  h3 {
    font-size: 25px;
    font-weight: 200;
  }
  .rwds_load_content {
    align-items: center;
    h3,
    span.icon {
      display: inline-block;
      vertical-align: middle;
    }
    span.icon {
      font-size: 40px;
      height: auto;
      width: auto;
      margin-left: 10px;
    }
  }
}

.cancel_rs_fld {
  margin-top: 1rem;
  /deep/ {
    .input {
      background-color: #f5f6f7;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 5px 0 0 5px;
      border: 1px solid transparent;
      font-size: 15px;
      color: #3b3f57;
      height: 3.7rem;
      padding: 0 1rem;
      &:focus,
      &:hover {
        z-index: 0 !important;
      }
      &:focus {
        border-color: transparent;
        -webkit-box-shadow: 0 0 2px 0 #d9bd68;
        -moz-box-shadow: 0 0 2px 0 #d9bd68;
        box-shadow: 0 0 2px 0 #d9bd68;
        background-color: #ffffff;
      }
    }
    .button {
      margin-top: 0;
    }
  }
}
</style>




