<template lang="pug">
  .system-level
    template(v-if="per_deny === true")
      h2.title.has-text-centered.has-text-weight-light Permission Denied!
      p.has-text-centered {{ pd_msg }}
    table.table.is-fullwidth.is-bordered(v-else)
      thead
        tr
          th(width="150px") Level
          th Rewards
          th(width="300px") Per Level People
      tbody
        tr(v-for="row in gen_data" :class="{ passed: (row.passed === true), active: (row.active === true) }")
          td 
            b-icon(v-if="row.active === true" pack="fas" icon="caret-right")
            | {{ row.lvl }}
          td {{ row.rwd }}
          td 
            | {{ row.pp }}
            button.button.is-small.claim-btn(v-if="row.claim_rwds && row.claim_rwds.can_claim === true && !isSubmited(row)" @click.prevent="claimSbt(row.lvl_id)") Claim Reward
            button.button.is-small.claim-btn.disabled(v-else-if="row.claim_rwds && row.claim_rwds.can_claim === true && isSubmited(row) && getSbtSts(row) === 0") In Process
            button.button.is-small.claim-btn.disabled(v-else-if="row.claim_rwds && row.claim_rwds.can_claim === true && isSubmited(row) && getSbtSts(row) === 1") Claimed

            b-tooltip(v-if="row.active === true" :label="row.comp_prg+'%'" position="is-top" type="is-light" animated)
              progress.progress.is-warning(:value="row.comp_prg" max="100")
    b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
import _ from "lodash";
export default {
  layout: "admin_layout",
  async mounted() {
    const self = this;
    self.loading = true;
    await self.$axios
      .get("/api/member/get_direct_ref_c")
      .then(res => {
        if (res.data.status !== false) {
          let c_tot = parseInt(res.data.ref_count);
          for (let ind in self.gen_data) {
            let g_data = self.gen_data[ind];
            if (g_data.act_p >= c_tot) {
              self.gen_data[ind]["active"] = true;
              let pend_per = Math.round(
                ((g_data.act_p - c_tot) / g_data.act_p) * 100
              );
              self.gen_data[ind]["comp_prg"] = 100 - pend_per;
              break;
            } else {
              if (_.hasIn(self.gen_data[ind], "claim_rwds")) {
                self.gen_data[ind].claim_rwds.can_claim = true;
              }
              self.gen_data[ind]["passed"] = true;
            }
          }
        } else {
          self.per_deny = true;
          self.pd_msg = res.data.message;
        }
      })
      .catch(err => {
        console.log(err);
      });
    await self.loadClaims();
    self.loading = false;
  },
  data() {
    let gen_data = [
      {
        lvl_id: 0,
        lvl: "You",
        rwd: "None",
        pp: 1,
        act_p: 1,
      },
      {
        lvl_id: 1,
        lvl: "1st Level",
        rwd: "None",
        pp: 1,
        act_p: 1,
      },
      {
        lvl_id: 2,
        lvl: "2nd Level",
        rwd: "None",
        pp: 1,
        act_p: 1,
      },
      {
        lvl_id: 3,
        lvl: "3rd Level",
        rwd: "CD 70",
        pp: 1,
        act_p: 1,
        claim_rwds: {
          can_claim: false
        }
      },
      {
        lvl_id: 4,
        lvl: "4th Level",
        rwd: "120 SQYD PLOT",
        pp: 1,
        act_p: 1,
        claim_rwds: {
          can_claim: false
        }
      },
      {
        lvl_id: 5,
        lvl: "5th Level",
        rwd: "Coming Soon",
        pp: 1,
        act_p: 1,
      },
      {
        lvl_id: 6,
        lvl: "6th Level",
        rwd: "Coming Soon",
        pp: 1,
        act_p: 1,
      },
      {
        lvl_id: 7,
        lvl: "7th Level",
        rwd: "Coming Soon",
        pp: 1,
        act_p: 1,
      },
      {
        lvl_id: 8,
        lvl: "8th Level",
        rwd: "Coming Soon",
        pp: 1,
        act_p: 1,
      },
      {
        lvl_id: 9,
        lvl: "9th Level",
        rwd: "Coming Soon",
        pp: 1,
        act_p: 1,
      }
    ];
    let dir_inc = 0;
    for (let ind in gen_data) {
      if (ind > 0) {
        gen_data[ind].pp = gen_data[ind - 1].pp * 4;
        gen_data[ind].act_p = gen_data[ind - 1].act_p + gen_data[ind].pp
      }
    }
    return {
      re_claim_sbt: false,
      pd_msg: "",
      per_deny: false,
      loading: true,
      gen_data,
      submited_claims: []
    };
  },
  methods: {
    getSbtSts(item) {
      const self = this;
      let g_sts = _.find(self.submited_claims, { lvl_id: item.lvl_id });
      return _.get(g_sts, "status", null);
    },
    isSubmited(item) {
      return this.getSbtSts(item) !== null ? true : false;
    },
    async loadClaims() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/reward/self_rwds")
        .then(res => {
          if (res.data.results.length > 0) {
            let result = res.data.results;
            self.submited_claims = [];
            _.each(result, i => {
              self.submited_claims.push({
                lvl_id: i.level,
                status: i.status
              });
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    },
    async claimSbt(lvl_id) {
      const self = this;
      let msg = "",
        is_err = false;
      self.loading = true;
      await self.$axios
        .post("/api/reward/claim", {
          is_self: 1,
          level: lvl_id
        })
        .then(res => {
          if (res.data.status === true) {
            msg = "Successfully Claim Request Submited.";
          } else {
            msg = res.data.message;
            is_err = true;
          }
        })
        .catch(err => {
          msg = err.message;
          is_err = true;
          console.log(err);
        });
      self.loading = false;
      self.$toast.open({
        duration: 3000,
        message: msg,
        position: "is-bottom",
        type: is_err ? "is-danger" : "is-success"
      });
      if (is_err !== true) {
        await self.loadClaims();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.system-level /deep/ {
  position: relative;
  .table {
    box-shadow: 0 0 10px 4px #3333331a;
    tr {
      th:first-child,
      td:first-child {
        border-left: none;
      }
      th:last-child,
      td:last-child {
        border-right: none;
      }
      th,
      td {
        border-top: none;
      }
    }
    thead {
      background-color: white;
      th {
        text-transform: uppercase;
        padding: 12px 20px;
      }
    }
    tbody {
      tr {
        td {
          background-color: #ffffff;
          padding: 12px 20px;
          font-weight: 300;
          color: #737373;
        }
        &.passed {
          td {
            border-bottom-color: white;
            background-color: #f6f6f6;
            color: #9a9a9a;

            .claim-btn {
              float: right;
              background-color: #3f3d5c;
              border: 2px solid #d3c05c;
              text-transform: uppercase;
              color: white;
              font-weight: 500;
              padding: 5px 10px;
              height: auto;

              &.disabled {
                background-color: #8886a0;
                &:focus {
                  box-shadow: none;
                }
              }

              &:focus {
                box-shadow: 0 0 3px 0px #d3c05c;
              }
            }
          }
        }
        &.active {
          td {
            color: white;
            font-weight: 400;
            background-color: #3d3e5a;
            .icon {
              position: absolute;
              left: 0;
            }
            .tooltip {
              display: block;
              position: relative;
              float: right;
              bottom: 6px;
              &:before {
                bottom: calc(100% - 10px);
              }
              &:after {
                bottom: calc(100% - 5px);
              }
              .progress {
                display: inline-block;
                height: 5px;
                width: 150px;
              }
            }
          }
        }
      }

      tr:last-child {
        td {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
