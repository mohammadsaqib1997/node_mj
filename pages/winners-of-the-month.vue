<template>
  <div class="wrapper">
    <div class="container">
      <div class="section">
        <div class="columns is-variable is-4 main-cont">
          <div class="column">
            <h1 class="title-1">Auto Reward Winners</h1>
            <div class="table-cont">
              <b-loading :is-full-page="false" :active="auto_loading" :can-cancel="false"></b-loading>
              <template v-if="auto_loading !== true || auto_rwds.length > 0">
                <template v-if="auto_rwds.length > 0">
                  <table class="table is-fullwidth is-striped rwds-tbl">
                    <thead>
                      <tr>
                        <th><abbr title="Monthly Rank">Rk#</abbr></th>
                        <th>Profile</th>
                        <th>Name</th>
                        <th><abbr title="Current Level">CUR LVL</abbr></th>
                        <th><abbr title="Reward">RWD</abbr></th>
                        <th><abbr title="Reward Level">RWD LVL</abbr></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, ind) in auto_rwds" :key="ind">
                        <th>{{ ind+1 }}</th>
                        <td>
                          <userThumbLazy :img="row.file_name"></userThumbLazy>
                        </td>
                        <td>{{ row.full_name }}</td>
                        <td>LVL {{ row.level }}</td>
                        <td>{{ getLvlRwd(0, row.rwd_level, 'rwds.['+row.reward_selected+']') }}</td>
                        <td>{{ getLvlRwd(0, row.rwd_level, 'lvl') }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <b-field v-if="auto_load_more === true" class="has-text-centered">
                    <button class="button is-small btn-des-2" @click.prevent="auto_params.page+=1;loadData_auto()">Load
                      More</button>
                  </b-field>
                </template>
                <h1 v-else class="title" style="line-height: normal;color: #a0a0a0;">No Data Found!</h1>

              </template>
            </div>

          </div>
          <div class="column">
            <h1 class="title-1">Self Reward Winners</h1>
            <div class="table-cont">
              <b-loading :is-full-page="false" :active="self_loading" :can-cancel="false"></b-loading>
              <template v-if="self_loading !== true || self_rwds.length > 0">
                <template v-if="self_rwds.length > 0">
                  <table class="table is-fullwidth is-striped rwds-tbl">
                    <thead>
                      <tr>
                        <th><abbr title="Monthly Rank">Rk#</abbr></th>
                        <th>Profile</th>
                        <th>Name</th>
                        <th><abbr title="Current Level">CUR LVL</abbr></th>
                        <th><abbr title="Reward">RWD</abbr></th>
                        <th><abbr title="Reward Level">RWD LVL</abbr></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, ind) in self_rwds" :key="ind">
                        <th>{{ ind+1 }}</th>
                        <td>
                          <userThumbLazy :img="row.file_name"></userThumbLazy>
                        </td>
                        <td>{{ row.full_name }}</td>
                        <td>LVL {{ row.level }}</td>
                        <td>{{ getLvlRwd(1, row.rwd_level, 'rwds.['+row.reward_selected+']') }}</td>
                        <td>{{ getLvlRwd(1, row.rwd_level, 'lvl') }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <b-field v-if="self_load_more === true" class="has-text-centered">
                    <button class="button is-small btn-des-2" @click.prevent="self_params.page+=1;loadData_self()">Load
                      More</button>
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
import userThumbLazy from '~/components/html_comp/lazy_user_thumb.vue';
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
      auto_rwds: [],
      auto_params: {
        page: 1
      },
      self_loading: true,
      self_load_more: true,
      self_rwds: [],
      self_params: {
        page: 1
      }
    };
  },
  methods: {
    async loadData_auto() {
      const self = this;
      self.auto_loading = true;
      await self.$axios
        .get("/api/web/get_list_winners_auto", {
          params: self.auto_params
        })
        .then(res => {
          let prev_data = _.cloneDeep(self.auto_rwds);
          self.auto_rwds = _.flatten([prev_data, res.data.result]);
          self.auto_load_more = res.data.tot_rows > self.auto_rwds.length;
        })
        .catch(err => {
          console.log(err);
        });
      self.auto_loading = false;
    },
    async loadData_self() {
      const self = this;
      self.self_loading = true;
      await self.$axios
        .get("/api/web/get_list_winners_self", {
          params: self.self_params
        })
        .then(res => {
          let prev_data = _.cloneDeep(self.self_rwds);
          self.self_rwds = _.flatten([prev_data, res.data.result]);
          self.self_load_more = res.data.tot_rows > self.self_rwds.length;
        })
        .catch(err => {
          console.log(err);
        });
      self.self_loading = false;
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