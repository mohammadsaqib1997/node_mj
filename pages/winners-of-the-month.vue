<template>
  <div class="wrapper">
    <div class="container">
      <div class="section">
        <div class="columns is-variable is-4 main-cont">
          <div class="column">
            <h1 class="title-1">Auto Reward Winners
              <template v-if="auto_params.prev_mnth_inc > 0">
                <br>
                {{ auto_loaded_m }}
              </template>
            </h1>
            <div class="table-cont">
              <b-loading :is-full-page="false" :active="auto_loading" :can-cancel="false"></b-loading>
              <template v-if="auto_loading !== true || auto_rwds.length > 0">
                <b-field class="btn-cont" grouped>
                  <p class="control" v-if="a_p_mnth_has">
                    <button class="button" @click.prevent="prev_mnth_load('auto')">Previous Month</button>
                  </p>
                  <p class="control" v-if="auto_params.prev_mnth_inc > 0">
                    <button class="button" @click.prevent="next_mnth_load('auto')">Next Month</button>
                  </p>
                </b-field>
                <template v-if="auto_rwds.length > 0">
                  <table class="table is-fullwidth is-striped rwds-tbl">
                    <thead>
                      <tr>
                        <th>
                          <abbr title="Monthly Rank">Rk#</abbr>
                        </th>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>
                          <abbr title="Current Level">CUR LVL</abbr>
                        </th>
                        <th>
                          <abbr title="Reward">RWD</abbr>
                        </th>
                        <th>
                          <abbr title="Reward Level">RWD LVL</abbr>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, ind) in auto_rwds" :key="ind">
                        <th>{{ ind+1 }}</th>
                        <td>
                          <userThumbLazy :img="row.file_name" :key="ind"></userThumbLazy>
                        </td>
                        <td>{{ row.full_name }}</td>
                        <td>LVL {{ row.level }}</td>
                        <td>{{ getLvlRwd(0, row.rwd_level, 'rwds.['+row.reward_selected+']') }}</td>
                        <td>{{ getLvlRwd(0, row.rwd_level, 'lvl') }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <b-field v-if="auto_load_more === true" class="has-text-centered">
                    <button
                      class="button is-small btn-des-2"
                      @click.prevent="auto_params.page+=1;loadData_auto()"
                    >
                      Load
                      More
                    </button>
                  </b-field>
                </template>
                <h1 v-else class="title" style="line-height: normal;color: #a0a0a0;">No Data Found!</h1>
              </template>
            </div>
          </div>
          <div class="column">
            <h1 class="title-1">Self Reward Winners
              <template v-if="self_params.prev_mnth_inc > 0">
                <br>
                {{ self_loaded_m }}
              </template>
            </h1>
            <div class="table-cont">
              <b-loading :is-full-page="false" :active="self_loading" :can-cancel="false"></b-loading>
              <template v-if="self_loading !== true || self_rwds.length > 0">
                <b-field class="btn-cont" grouped>
                  <p class="control" v-if="s_p_mnth_has">
                    <button class="button" @click.prevent="prev_mnth_load('self')">Previous Month</button>
                  </p>
                  <p class="control" v-if="self_params.prev_mnth_inc > 0">
                    <button class="button" @click.prevent="next_mnth_load('self')">Next Month</button>
                  </p>
                </b-field>
                <template v-if="self_rwds.length > 0">
                  <table class="table is-fullwidth is-striped rwds-tbl">
                    <thead>
                      <tr>
                        <th>
                          <abbr title="Monthly Rank">Rk#</abbr>
                        </th>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>
                          <abbr title="Current Level">CUR LVL</abbr>
                        </th>
                        <th>
                          <abbr title="Reward">RWD</abbr>
                        </th>
                        <th>
                          <abbr title="Reward Level">RWD LVL</abbr>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, ind) in self_rwds" :key="ind">
                        <th>{{ ind+1 }}</th>
                        <td>
                          <userThumbLazy :img="row.file_name" :key="ind"></userThumbLazy>
                        </td>
                        <td>{{ row.full_name }}</td>
                        <td>LVL {{ row.level }}</td>
                        <td>{{ getLvlRwd(1, row.rwd_level, 'rwds.['+row.reward_selected+']') }}</td>
                        <td>{{ getLvlRwd(1, row.rwd_level, 'lvl') }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <b-field v-if="self_load_more === true" class="has-text-centered">
                    <button
                      class="button is-small btn-des-2"
                      @click.prevent="self_params.page+=1;loadData_self()"
                    >
                      Load
                      More
                    </button>
                  </b-field>
                </template>
                <h1 v-else class="title" style="line-height: normal;color: #a0a0a0;">No Data Found!</h1>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userThumbLazy from "~/components/html_comp/lazy_user_thumb.vue";
import mxn_rewardsData from "~/mixins/rewards-data.js";
import _ from "lodash";
export default {
  mixins: [mxn_rewardsData],
  components: {
    userThumbLazy
  },
  mounted() {
    this.loadData_auto();
    this.loadData_self();
  },
  data() {
    return {
      auto_loading: true,
      auto_load_more: true,
      a_p_mnth_has: false,
      auto_loaded_m: null,
      auto_rwds: [],
      auto_params: {
        page: 1,
        prev_mnth_inc: 0
      },
      self_loading: true,
      self_load_more: true,
      s_p_mnth_has: false,
      self_loaded_m: null,
      self_rwds: [],
      self_params: {
        page: 1,
        prev_mnth_inc: 0
      }
    };
  },
  methods: {
    async loadData_auto(strict) {
      const self = this;
      self.auto_loading = true;
      await self.$axios
        .get("/api/web/get_list_winners_auto", {
          params: self.auto_params
        })
        .then(res => {
          let prev_data = _.cloneDeep(self.auto_rwds);
          if (strict === true) {
            self.auto_rwds = res.data.result;
          } else {
            self.auto_rwds = _.flatten([prev_data, res.data.result]);
          }
          self.auto_loaded_m = res.data.gen_my;
          self.auto_load_more = res.data.cur_tot > self.auto_rwds.length;
          self.a_p_mnth_has = res.data.prev_tot > 0;
        })
        .catch(err => {
          console.log(err);
        });
      self.auto_loading = false;
    },
    async loadData_self(strict) {
      const self = this;
      self.self_loading = true;
      await self.$axios
        .get("/api/web/get_list_winners_self", {
          params: self.self_params
        })
        .then(res => {
          let prev_data = _.cloneDeep(self.self_rwds);
          if (strict === true) {
            self.self_rwds = res.data.result;
          } else {
            self.self_rwds = _.flatten([prev_data, res.data.result]);
          }
          self.self_loaded_m = res.data.gen_my;
          self.self_load_more = res.data.cur_tot > self.self_rwds.length;
          self.s_p_mnth_has = res.data.prev_tot > 0;
        })
        .catch(err => {
          console.log(err);
        });
      self.self_loading = false;
    },
    prev_mnth_load(param_key) {
      const self = this;
      self[param_key + "_params"] = {
        page: 1,
        prev_mnth_inc:
          _.get(self[param_key + "_params"], "prev_mnth_inc", 0) + 1
      };
      self["loadData_" + param_key](true);
    },
    next_mnth_load(param_key) {
      const self = this;
      self[param_key + "_params"] = {
        page: 1,
        prev_mnth_inc:
          _.get(self[param_key + "_params"], "prev_mnth_inc", 1) - 1
      };
      self["loadData_" + param_key](true);
    }
  }
};
</script>


<style lang="scss" scoped>
.wrapper {
  /deep/ {
    h1.title-1 {
      font-size: 34px;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }

    .btn-cont {
      button {
        padding: 5px 10px;
        height: auto;
        line-height: normal;
        border-radius: 0;
        border: 1px solid #d7bb6e;
        text-transform: uppercase;
        font-size: 12px;
        &:hover {
          border: 1px solid #a58839;
        }
        &:focus {
          box-shadow: none;
        }
      }
    }

    .main-cont {
      @media screen and (min-width: 769px) {
        & > .column:first-child {
          border-right: 1px solid #d9bd68;
        }

        & > .column:last-child {
          border-left: 1px solid #d9bd68;
        }
      }

      .table-cont {
        position: relative;
        overflow: auto;
        min-height: 200px;
        padding-bottom: 1rem;

        .btn-des-2 {
          background-color: #3b3f58;
          color: #d9bd68;
          border-color: #d9bd68;
          height: auto;
          line-height: 17px;
          border-radius: 0;

          &:focus {
            box-shadow: 0 0 2px 2px #fff2cb;
          }
        }

        .rwds-tbl {
          thead {
            th {
              text-transform: uppercase;
            }
          }

          tbody {
            td,
            th {
              vertical-align: middle;
            }

            .thumb {
              display: block;
              max-width: 50px;
              max-height: 50px;
            }
          }
        }
      }
    }
  }
}
</style>