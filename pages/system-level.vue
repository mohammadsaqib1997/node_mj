<template lang="pug">
	.system-level
		template(v-if="per_deny === true")
			h2.title.has-text-centered.has-text-weight-light Permission Denied!
			p.has-text-centered {{ pd_msg }}
		table.table.is-fullwidth.is-bordered(v-else)
			thead
				tr
					th Level
					//- th Commission
					th Rewards
					th Total No. People Possible
			tbody
				tr(v-for="row in gen_data" :class="{ passed: (row.passed === true), active: (row.active === true) }")
					td 
						b-icon(v-if="row.active === true" pack="fas" icon="caret-right")
						| {{ row.lvl }}
					//- td {{ row.cm }}
					td {{ row.rwd }}
					td 
						| {{ row.pp }}
						b-tooltip(v-if="row.active === true" :label="row.comp_prg+'%'" position="is-top" type="is-light" animated)
							progress.progress.is-warning(:value="row.comp_prg" max="100")
		b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
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
            if (g_data.pp >= res.data.child_count) {
              self.gen_data[ind]["active"] = true;
              let pend_per = Math.round((g_data.pp - c_tot) / g_data.pp * 100);
              self.gen_data[ind]["comp_prg"] = 100 - pend_per;
              break;
            } else {
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
    self.loading = false;
  },
  data() {
    let gen_data = [
      {
        lvl: "You",
        cm: "None",
        rwd: "None",
        pp: 1
      },
      {
        lvl: "1st Level",
        cm: "None",
        rwd: "None",
        pp: 1
      },
      {
        lvl: "2nd Level",
        cm: "None",
        rwd: "None",
        pp: 1
      },
      {
        lvl: "3rd Level",
        cm: "None",
        rwd: "Laptop OR 25,000 Cash",
        pp: 1
      },
      {
        lvl: "4th Level",
        cm: "None",
        rwd: "Mobile OR 50,000 Cash",
        pp: 1
      },
      {
        lvl: "5th Level",
        cm: "None",
        rwd: "CG-125 Motorcycle OR 100,000 Cash",
        pp: 1
      },
      {
        lvl: "6th Level",
        cm: "None",
        rwd: "Ummrah With Dubai Tour OR 200,000 Cash",
        pp: 1
      },
      {
        lvl: "7th Level",
        cm: "None",
        rwd: "Malaysia Tour Or 300,000 Cash",
        pp: 1
      },
      {
        lvl: "8th Level",
        cm: "None",
        rwd: "Gli New Model Current Year OR 18,000 $",
        pp: 1
      },
      {
        lvl: "9th Level",
        cm: "None",
        rwd: "Toyota Fortuner 2018 OR 50,000 $",
        pp: 1
      },
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
        let next_pp = gen_data[ind - 1].pp * 4;
        gen_data[ind].pp = next_pp;
        dir_inc++;
        if (dir_inc === 1) {
          gen_data[ind].cm = "1000 x " + next_pp + " = " + 1000 * next_pp;
        } else if (dir_inc === 2) {
          gen_data[ind].cm = "300 x " + next_pp + " = " + 300 * next_pp;
        } else {
          gen_data[ind].cm = "200 x " + next_pp + " = " + 200 * next_pp;
        }
      }
    }
    return {
      pd_msg: "",
      per_deny: false,
      loading: true,
      gen_data
    };
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
