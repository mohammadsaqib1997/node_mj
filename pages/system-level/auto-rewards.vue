<template lang="pug">
  .system-level
    template(v-if="per_deny === true")
      h2.title.has-text-centered.has-text-weight-light Permission Denied!
      p.has-text-centered {{ pd_msg }}
    table.table.is-fullwidth.is-bordered(v-else)
      thead
        tr
          th(width="150px") Level
          //- th Commission
          th Rewards
          th(width="300px") Total No. People Possible
          th(width="300px") Total DIRECT REFERRAL
      tbody
        tr(v-for="(row, ind) in gen_data" :key="ind" :class="{ passed: (row.passed === true), active: (row.active === true) }")
          td 
            b-icon(v-if="row.active === true" pack="fas" icon="caret-right")
            | {{ row.lvl }}
          //- td {{ row.cm }}
          td {{ row.rwd }}
          td 
            | {{ row.pp }}
            b-tooltip(v-if="row.active === true && ind>0" :label="row.comp_prg+'%'" position="is-top" type="is-light" animated)
              progress.progress.is-warning(:value="row.comp_prg" max="100")
          td
            .flex
              p {{ row.dr }}
              button.button.is-small.claim-btn(v-if="row.claim_rwds && row.claim_rwds.can_claim === true && !isSubmited(row)" @click.prevent="setItemMD(row.lvl_id)") Claim Reward
              button.button.is-small.claim-btn.disabled(v-else-if="row.claim_rwds && row.claim_rwds.can_claim === true && isSubmited(row) && getSbtSts(row) === 0") In Process
              button.button.is-small.claim-btn.disabled(v-else-if="row.claim_rwds && row.claim_rwds.can_claim === true && isSubmited(row) && getSbtSts(row) === 1") Claimed
    b-loading(:is-full-page="false" :active="loading" :can-cancel="false")

    b-modal.modal-des-1.md-claim(:active.sync="md_active" :has-modal-card="true" :canCancel="md_close_btn" @close="closeMDTrg")
      .modal-card
        .modal-card-body
          .section(v-if="active_item_md != null")
            .columns
              .column(v-if="active_item_md.rwd")
                .prd-cont(:class="{ active: sel_c_rwd === 0 }" @click.prevent="sel_c_rwd=0")
                  span.icon(v-if="active_item_md.rwd.icon" v-html="active_item_md.rwd.icon")
                  img(v-else-if="active_item_md.rwd.img" :src="active_item_md.rwd.img")
                  .title {{ active_item_md.rwd.title }}

              .column(v-if="active_item_md.cash")
                .prd-cont(:class="{ active: sel_c_rwd === 1 }" @click.prevent="sel_c_rwd=1")
                  span.icon
                    i.fas.fa-money-bill-alt
                  .title Cash
                  .sub-title {{ active_item_md.cash.title }}
            b-field.has-text-centered(v-if="sel_c_rwd !== null")
              button.button.btn-des-1(@click.prevent="claimSbt") Claim Reward
        b-loading(:is-full-page="false" :active="form.loading" :can-cancel="false")
</template>

<script>
import _ from "lodash";
export default {
  layout: "admin_layout",
  async mounted() {
    const self = this;
    self.loading = true;
    await self.$axios
      .get("/api/member/get_level_info")
      .then(res => {
        if (res.data.status !== false) {
          let c_tot = parseInt(res.data.child_count);
          for (let ind in self.gen_data) {
            let g_data = self.gen_data[ind];
            // check index 0 and 1 refferal found so claim reward
            if (ind == 0 && parseInt(res.data.direct_ref) >= g_data.dr_total) {
              if (_.hasIn(self.gen_data[ind], "claim_rwds")) {
                self.gen_data[ind].claim_rwds.can_claim = true;
              }
            }

            if (
              !isNaN(parseInt(g_data.pp)) &&
              g_data.pp >= res.data.child_count
            ) {
              self.gen_data[ind]["active"] = true;
              let pend_per = Math.round(
                ((g_data.pp - c_tot) / g_data.pp) * 100
              );
              self.gen_data[ind]["comp_prg"] = 100 - pend_per;
              break;
            } else {
              if (
                _.hasIn(self.gen_data[ind], "claim_rwds") &&
                parseInt(res.data.direct_ref) >= g_data.dr_total
              ) {
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
        cm: "None",
        rwd: "Business Kit",
        pp: "You",
        dr: "1",
        dr_total: 1,
        claim_rwds: {
          can_claim: false,
          rwd: {
            title: "Business Kit",
            icon: null,
            img: "/img/rewards-icon/baggage.png"
          }
        }
      },
      {
        lvl_id: 1,
        lvl: "1st Level",
        cm: "None",
        rwd: "Watch",
        pp: 1,
        dr: "1 + 1",
        dr_total: 2,
        claim_rwds: {
          can_claim: false,
          rwd: {
            title: "Watch",
            icon: null,
            img: "/img/rewards-icon/wristwatch.png"
          }
        }
      },
      {
        lvl_id: 2,
        lvl: "2nd Level",
        cm: "None",
        rwd: "Travelling bag",
        pp: 1,
        dr: "1 + 1 + 1",
        dr_total: 3,
        claim_rwds: {
          can_claim: false,
          rwd: {
            title: "Travelling bag",
            icon: null,
            img: "/img/rewards-icon/backpack.png"
          }
        }
      },
      {
        lvl_id: 3,
        lvl: "3rd Level",
        cm: "None",
        rwd: "Mobile OR 25,000 Cash",
        pp: 1,
        dr: "1 + 1 + 1 + 4",
        dr_total: 7,
        claim_rwds: {
          can_claim: false,
          cash: {
            title: "Rs. 25,000/-"
          },
          rwd: {
            title: "Mobile",
            icon: '<i class="fas fa-mobile-alt"></i>'
          }
        }
      },
      {
        lvl_id: 4,
        lvl: "4th Level",
        cm: "None",
        rwd: "Laptop OR 50,000 Cash",
        pp: 1,
        dr: "7 old + 4 new",
        dr_total: 1,
        claim_rwds: {
          can_claim: false,
          cash: {
            title: "Rs. 50,000/-"
          },
          rwd: {
            title: "Laptop",
            icon: '<i class="fas fa-laptop"></i>'
          }
        }
      },
      {
        lvl_id: 5,
        lvl: "5th Level",
        cm: "None",
        rwd: "CG-125 Motorcycle OR 100,000 Cash",
        pp: 1,
        dr: "11 old + 4 new",
        dr_total: 1,
        claim_rwds: {
          can_claim: false,
          cash: {
            title: "Rs. 100,000/-"
          },
          rwd: {
            title: "CG-125 Motorcycle",
            icon: '<i class="fas fa-motorcycle"></i>'
          }
        }
      },
      {
        lvl_id: 6,
        lvl: "6th Level",
        cm: "None",
        rwd: "Ummrah With Dubai Tour OR 200,000 Cash",
        pp: 1,
        dr: "15 old + 4 new",
        dr_total: 1,
        claim_rwds: {
          can_claim: false,
          cash: {
            title: "Rs. 200,000/-"
          },
          rwd: {
            title: "Ummrah With Dubai Tour",
            icon: '<i class="fas fa-ticket-alt"></i>'
          }
        }
      },
      {
        lvl_id: 7,
        lvl: "7th Level",
        cm: "None",
        rwd: "Malaysia Tour Or 300,000 Cash",
        pp: 1,
        dr: "19 old + 4 new",
        dr_total: 1,
        claim_rwds: {
          can_claim: false,
          cash: {
            title: "Rs. 300,000/-"
          },
          rwd: {
            title: "Malaysia Tour",
            icon: '<i class="fas fa-ticket-alt"></i>'
          }
        }
      },
      {
        lvl_id: 8,
        lvl: "8th Level",
        cm: "None",
        rwd: "Gli New Model Current Year OR 18,000 $",
        pp: 1,
        dr: "23 old + 4 new",
        dr_total: 1,
        claim_rwds: {
          can_claim: false,
          cash: {
            title: "$. 18,000/-"
          },
          rwd: {
            title: "Gli New Model Current Year",
            icon: '<i class="fas fa-car"></i>'
          }
        }
      },
      {
        lvl_id: 9,
        lvl: "9th Level",
        cm: "None",
        rwd: "Toyota Fortuner 2018 OR 50,000 $",
        pp: 1,
        dr: "27 old + 4 new",
        dr_total: 1,
        claim_rwds: {
          can_claim: false,
          cash: {
            title: "$. 50,000/-"
          },
          rwd: {
            title: "Toyota Fortuner 2018",
            icon: '<i class="fas fa-shuttle-van"></i>'
          }
        }
      }
      // {
      //   lvl: "10th Level",
      //   cm: "None",
      //   rwd: "World Tour OR 100,000 $",
      //   pp: 1
      // }
    ];
    let dir_inc = 0;
    for (let ind in gen_data) {
      if (ind > 0) {
        gen_data[ind].pp = (ind > 1 ? gen_data[ind - 1].pp : 1) * 4;
      }
      if (ind > 3) {
        gen_data[ind].dr_total = gen_data[ind - 1].dr_total + 4;
      }
    }
    return {
      pd_msg: "",
      per_deny: false,
      loading: true,
      gen_data,
      submited_claims: [],
      active_item_md: null,
      md_active: false,
      sel_c_rwd: null,
      md_close_btn: ["x"],
      form: {
        loading: false,
        data: {}
      }
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
        .get("/api/reward/auto_rwds")
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
    setItemMD(lvl_id, has_re_claim) {
      const self = this;
      let find_item = _.find(self.gen_data, { lvl_id });
      if (find_item) {
        let rwd_item = _.cloneDeep(find_item.claim_rwds);
        rwd_item["lvl_id"] = lvl_id;
        self.active_item_md = rwd_item;
        self.md_active = true;
      }
    },
    closeMDTrg() {
      const self = this;
      self.sel_c_rwd = null;
      self.active_item_md = null;
      self.md_close_btn = ["x"];
    },
    async claimSbt() {
      const self = this;
      let msg = "",
        is_err = false;
      self.form.loading = true;
      self.md_close_btn = false;
      await self.$axios
        .post("/api/reward/claim", {
          reward_selected: self.sel_c_rwd,
          level: self.active_item_md.lvl_id
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
      self.form.loading = false;
      self.md_active = false;
      self.closeMDTrg();
      self.$toast.open({
        duration: 3000,
        message: msg,
        position: "is-bottom",
        type: is_err ? "is-danger" : "is-success"
      });
      self.loadClaims();
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
          .flex {
            display: flex;
            align-items: center;
            p {
              flex-grow: 1;
            }
          }
        }
        &.passed {
          td {
            border-bottom-color: white;
            background-color: #f6f6f6;
            color: #9a9a9a;
          }
        }
        &.active {
          td {
            color: white;
            font-weight: 400;
            background-color: #3d3e5a;
            vertical-align: middle;
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
  .md-claim {
    .prd-cont {
      background-color: #3d3e5a;
      height: 100%;
      text-align: center;
      padding: 1rem;
      border-radius: 5px;
      border: 2px solid transparent;
      margin: 0 auto;
      max-width: 300px;
      cursor: pointer;
      &.active,
      &:hover {
        border: 2px solid #d9bd68;
      }
      .icon {
        font-size: 3rem;
        width: auto;
        height: auto;
        color: #f1f1f1;
      }
      img {
        max-width: 60px;
      }
      .title {
        color: #f1f1f1;
        line-height: normal;
        margin-top: 1.5rem;
        margin-bottom: 0;
        text-transform: uppercase;
        font-weight: 300;
      }
      .sub-title {
        font-size: 20px;
        color: #d9bd68;
      }
    }
  }
}
</style>
