<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Lucy Draw</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <div class="columns is-multiline __tabs">
            <div class="column is-12 is-6-desktop">
              <button
                :class="['button btn-des-1', {'is-active': tab_act === 0}]"
                @click.prevent="tab_act=0"
              >Daily Lucky Draw</button>
            </div>
            <div class="column is-12 is-6-desktop">
              <button
                :class="['button btn-des-1', {'is-active': tab_act === 1}]"
                @click.prevent="tab_act=1"
              >Previous Lucky Draw</button>
            </div>
          </div>
          <div class="columns is-multiline __tab_content">
            <div :class="['column is-12', {'is-active': tab_act === 0}]">
              <div class="columns">
                <div class="column is-12 is-6-desktop">
                  <!-- SIDC Card -->
                  <h1 class="title is-4 has-text-centered">SIDC Card</h1>
                  <template v-if="prd_1.length > 0">
                    <template v-for="(grp, g_ind) in prd_1">
                      <table class="table is-fullwidth __gp_tb" :key="g_ind">
                        <thead>
                          <tr>
                            <th class="has-text-centered" colspan="4">Group {{ g_ind+1 }}</th>
                          </tr>
                          <tr>
                            <th>
                              <abbr title="Lucky Draw">LD</abbr> Serial#
                            </th>
                            <th>MJ ID</th>
                            <th>MJ Name</th>
                            <th>
                              <abbr title="Link Member">LM</abbr> ID
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, ind) in grp" :key="ind">
                            <td>{{ ind+1 }}</td>
                            <td>{{ row.user_asn_id }}</td>
                            <td>{{ row.full_name }}</td>
                            <td>{{ row.lnk_mem_id }}</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td class="has-text-centered" colspan="4">
                              <button
                                class="button btn-des-1"
                                v-if="checkIsSpin('prd_1', g_ind)"
                                @click.prevent="submitSpin(1, g_ind+1)"
                              >Spin</button>
                              <p
                                class="has-text-grey"
                                v-else
                              >Wait for day end or Completing group members.</p>
                              <!-- <p class="__win_content" v-if="grp_win">Group Winner: 000000001</p> -->
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </template>
                  </template>
                  <section class="section" v-else>
                    <div class="content has-text-centered has-text-grey">
                      <p>
                        <b-icon icon="frown" pack="far" size="is-large"></b-icon>
                      </p>
                      <p>Nothing here.</p>
                    </div>
                  </section>
                </div>
                <div class="column is-12 is-6-desktop">
                  <!-- SIDC + Insurance Card -->
                  <h1 class="title is-4 has-text-centered">SIDC + Insurance Card</h1>
                  <template v-if="prd_2.length > 0">
                    <template v-for="(grp, ind) in prd_2">
                      <table class="table is-fullwidth __gp_tb" :key="ind">
                        <thead>
                          <tr>
                            <th class="has-text-centered" colspan="4">Group {{ ind+1 }}</th>
                          </tr>
                          <tr>
                            <th>
                              <abbr title="Lucky Draw">LD</abbr> Serial#
                            </th>
                            <th>MJ ID</th>
                            <th>MJ Name</th>
                            <th>
                              <abbr title="Link Member">LM</abbr> ID
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(row, ind) in grp" :key="ind">
                            <td>{{ ind+1 }}</td>
                            <td>{{ row.user_asn_id }}</td>
                            <td>{{ row.full_name }}</td>
                            <td>{{ row.lnk_mem_id }}</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td class="has-text-centered" colspan="4">
                              <button class="button btn-des-1">Spin</button>
                              <!-- <p class="__win_content" v-if="grp_win">Group Winner: 000000001</p> -->
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </template>
                  </template>
                  <section class="section" v-else>
                    <div class="content has-text-centered has-text-grey">
                      <p>
                        <b-icon icon="frown" pack="far" size="is-large"></b-icon>
                      </p>
                      <p>Nothing here.</p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div :class="['column is-12', {'is-active': tab_act === 1}]">
              <section class="section">
                <div class="content has-text-centered has-text-grey">
                  <p>
                    <b-icon icon="frown" pack="far" size="is-large"></b-icon>
                  </p>
                  <p>Nothing here.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  layout: "admin_layout",
  async mounted() {
    const self = this;
    self.loading = true;
    await self.$axios
      .get("/api/lucky-draw/ld-list/1")
      .then(res => {
        let org_data = res.data.data;
        let i = 0;
        let gen_data = [];
        let grp_data = [];
        _.each(org_data, function(o, ind) {
          i++;
          grp_data.push(o);
          if (i % 5 == 0) {
            gen_data.push(grp_data);
            grp_data = [];
          } else if (ind + 1 == org_data.length) {
            let prev_arr =
              gen_data.length > 0 ? gen_data[gen_data.length - 1] : [];
            let prev_arr_ind = gen_data.length > 0 ? gen_data.length - 1 : 0;
            gen_data[prev_arr_ind] = _.flatten([prev_arr, grp_data]);
            grp_data = [];
          }
        });
        self.prd_1 = gen_data;
      })
      .catch(err => {
        console.log(err);
      });
    await self.$axios
      .get("/api/lucky-draw/ld-list/2")
      .then(res => {
        let org_data = res.data.data;
        let i = 0;
        let gen_data = [];
        let grp_data = [];
        _.each(org_data, function(o, ind) {
          i++;
          grp_data.push(o);
          if (i % 5 == 0) {
            gen_data.push(grp_data);
            grp_data = [];
          } else if (ind + 1 == org_data.length) {
            let prev_arr =
              gen_data.length > 0 ? gen_data[gen_data.length - 1] : [];
            let prev_arr_ind = gen_data.length > 0 ? gen_data.length - 1 : 0;
            gen_data[prev_arr_ind] = _.flatten([prev_arr, grp_data]);
            grp_data = [];
          }
        });
        self.prd_2 = gen_data;
      })
      .catch(err => {
        console.log(err);
      });
    self.loading = false;
  },
  data() {
    return {
      loading: false,
      tab_act: 0,
      prd_1: [],
      prd_2: []
    };
  },
  methods: {
    checkIsSpin(prd_sel, ind) {
      let grp_data = _.get(this, prd_sel, [])[ind];
      let next_data = _.get(this, prd_sel, [])[ind + 1];
      if (grp_data.length === 5 && typeof next_data !== "undefined") {
        return true;
      }
      return false;
    },
    async submitSpin(prd, grp_pg) {
      const self = this;
      self.loading = true;
      await self.$axios
        .post(`/api/lucky-draw/today-spin/${prd}/${grp_pg}`)
        .then(res => {
          console.log(res.data)
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
.wrapper {
  /deep/ {
    .__tabs {
      .btn-des-1 {
        width: 100%;
        margin-top: 0;
        font-weight: 300;
        font-size: 20px;
        box-shadow: none;
        background-color: #3d3e5a;
        color: #d9bd68 !important;
        &:after {
          background-color: #2a2b42;
        }
        &.is-active {
          background-color: #d9bd68;
          color: #2a2b42 !important;
          box-shadow: 0 2px 20px 2px #ccc !important;
          &:after {
            background-color: #ab9142;
          }
        }
      }
    }
    .__tab_content {
      & > div.column {
        &:not(.is-active) {
          display: none;
        }
        .__gp_tb {
          .btn-des-1 {
            padding: 0 30px;
            min-height: 50px;
            margin-top: 0;
          }
        }
      }
    }
  }
}
</style>

