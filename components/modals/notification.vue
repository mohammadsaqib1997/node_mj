<template lang="pug">
  b-modal(:active="mdActive" :canCancel="false")
    .box.main-box
      .header.columns.is-gapless
        .column
            h1(v-if="a_item.type === 0") Notify
            h1(v-else-if="a_item.type === 1") Confirmation
            h1(v-else-if="a_item.type === 2") Withdrawal Request
            h1(v-else-if="a_item.type === 3") Reward Request
            h1(v-else) Notify
      .body
        .section
          //- here is simple message
          .show-info
            label(v-if="a_item.msg" v-html="strToHTML(a_item.msg)")
            
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
                .column.is-6
                  label Reward Type:
                .column
                  h3 {{ a_item.data.type == 1 ? 'Self Reward':'Auto Reward' }}
              .columns.is-gapless.rwds_load_content
                .column.is-6
                  label Reward Level:
                .column
                  h3 {{ getLvlRwd(a_item.data.type, a_item.data.level, 'lvl') }}
              .columns.is-gapless.rwds_load_content
                .column.is-6
                  label Reward Selected:
                .column
                  h3 {{ getLvlRwd(a_item.data.type, a_item.data.level, 'rwds.['+a_item.data.reward_selected+']') }}

                  //- span.icon(v-html="lvl_rwds[a_item.data.lvl][a_item.data.type].icon")

          //- here is footer
          template(v-if="a_item.type === 0")
            button.button.btn-des-1(@click.prevent="$store.commit('notification/modalActTG', false)")
              | Dismiss

          template(v-else-if="a_item.type === 1")
            template(v-if="loading !== true")
              template(v-if="a_item.hasOwnProperty('data') && a_item.data.paid === 0")
                button.button.btn-des-1(@click.prevent="$store.commit('notification/modalActTG', false)")
                  | Close
                button.button.btn-des-1(@click.prevent="payUser(a_item.from_id)" style="margin-left:10px")
                  | Pay
              button.button.btn-des-1(v-else @click.prevent="$store.commit('notification/modalActTG', false)")
                | Dismiss

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
            hr
            h4.title.is-5(v-if="a_item.data.status !== 0" style="margin-bottom:.5rem;") {{ a_item.data.status === 1 ? "Already Claim": "Canceled Claim" }}
            .level
              .level-left(v-if="a_item.data.status === 0")
                b-field.cancel_rs_fld(v-if="cancel_fm.is === true")
                  b-input(placeholder="Cancel Reason" v-model="cancel_fm.msg" expanded)
                  p.control
                    button.button.is-primary.btn-des-1(@click.prevent="claim_ch_sts(2)" style="margin-top:0;") Cancel
                template(v-else)
                  button.button.btn-des-1(@click.prevent="cancel_fm.is=true;")
                    | Cancel
                  button.button.btn-des-1(@click.prevent="claim_ch_sts(1)" style="margin-left:10px")
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
import mxn_rewardsData from "~/mixins/rewards-data.js";
export default {
  mixins: [mxn_rewardsData],
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
      }
    };
  },
  methods: {
    strToHTML(str) {
      return str.replace(/(?:\r\n|\r|\n)/g, "<br>");
    },
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
    claim_ch_sts: async function(sts) {
      const self = this;
      let is_err = false;
      let msg = "";
      self.$store.commit("notification/set_loader", true);
      await self.$axios
        .post("/api/reward/sts_change", {
          clm_id: self.a_item.ref_id,
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




