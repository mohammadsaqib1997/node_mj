<template>
  <div class="system-campaign">
    <div class="box counter-box">
      <div class="columns is-gapless is-multiline">
        <div class="column is-12-mobile is-6-tablet is-3-widescreen">
          <div class="flex">
            <div>
              <table class="table">
                <tbody>
                  <tr>
                    <td class="vert hd1 has-text-centered">Reward</td>
                  </tr>
                  <tr>
                    <td class="hd2 has-text-centered">Umra Package
                      <br>or
                      <br>100,000 Cash
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="column is-12-mobile is-6-tablet is-3-widescreen">
          <div class="flex">
            <div>
              <table class="table">
                <tbody>
                  <tr>
                    <td class="vert hd1 s1 has-text-right">Campaign Start:&nbsp;</td>
                    <td class="vert hd2 s1">20th Jan 2019</td>
                  </tr>
                  <tr>
                    <td class="vert hd1 s1 has-text-right">Campaign End:&nbsp;</td>
                    <td class="vert hd2 s1">31st March 2019</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="column is-12-mobile is-6-tablet is-3-widescreen">
          <div class="flex">
            <div>
              <table class="table">
                <tbody>
                  <tr>
                    <td class="hd1 has-text-centered">Campaign Referrals</td>
                  </tr>
                  <tr>
                    <td class="hd2 s2 has-text-centered">150</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="column is-12-mobile is-6-tablet is-3-widescreen">
          <div class="flex">
            <div>
              <table class="table">
                <tbody>
                  <tr>
                    <td class="hd1 has-text-centered">Your Referrals</td>
                  </tr>
                  <tr>
                    <td class="hd2 s2 has-text-centered">{{ tot_ref }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
    </div>
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Team Referrals</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <tblTopFilter
            :act_view="String(load_params.limit)"
            :s_txt="load_params.search"
            @change_act_view="update_params('limit', parseInt($event))"
            @change_s_txt="update_params('search', $event)"
          ></tblTopFilter>

          <tableComp
            :arr="l_data"
            :loading="loading"
            :striped="true"
            :total_record="num_rows"
            :per_page="parseInt(load_params.limit)"
            :page_set="load_params.page"
            @page_change="update_params('page', $event)"
          >
            <template slot="thead">
              <tr>
                <th width="200">MJ ID</th>
                <th>MJ Name</th>
                <th width="200">Team Referrals</th>
              </tr>
            </template>
            <template slot="tbody">
              <tr v-for="(row, ind) in l_data" :key="ind">
                <td>{{ row.mj_id }}</td>
                <td>{{ row.mj_name }}</td>
                <td>{{ row.total_ref }}</td>
              </tr>
            </template>
          </tableComp>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import tableComp from "~/components/html_comp/tableComp.vue";
export default {
  layout: "admin_layout",
  mixins: [mxn_tableFilterListing],
  components: {
    tableComp,
    tblTopFilter
  },
  async mounted() {
    await this.statusLoad();
  },
  data() {
    return {
      stsLoading: false,
      tot_ref: 0
    };
  },
  methods: {
    async statusLoad() {
      const self = this;
      self.stsLoading = true;
      await self.$axios
        .get("/api/campaign/member-tot-ref")
        .then(res => {
          self.tot_ref = res.data.total ? res.data.total : 0;
        })
        .catch(err => {
          console.log(err);
        });
      self.stsLoading = false;
    },
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/campaign/list-team-ref")
        .then(res => {
          self.l_data = res.data.data;
          self.num_rows = res.data.tot_rows;
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    }
  }
};
</script>

<style scoped lang="scss">
.system-campaign /deep/ {
  > .box.counter-box {
    position: relative;
    .amount-main {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      flex-wrap: wrap;
      .amount-item {
        padding: 0 1rem;
        h5 {
          color: #ffffff;
          font-weight: 600;
          text-transform: uppercase;
        }
        .amount-wrapper {
          b {
            font-size: 18px !important;
          }
          h1 {
            font-size: 22px !important;
            font-weight: 400 !important;
            line-height: 15px !important;
          }
        }
      }
    }
    .flex {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;

      .table {
        background-color: transparent;
        td {
          padding: 5px;
          border: 0;
          &.vert {
            vertical-align: middle;
          }
          &.hd1 {
            font-weight: 700;
            font-size: 20px;
            text-transform: uppercase;
            color: #d9bd68;
          }
          &.hd2 {
            color: white;
            font-weight: 600;
            font-size: 18px;
            text-transform: uppercase;
          }
          &.hd1,
          &.hd2 {
            &.s1 {
              font-size: 15px;
              font-weight: 500;
            }
            &.s2 {
              font-size: 30px;
              line-height: 25px;
              font-weight: 700;
            }
          }
        }
      }
    }

    .c-tile {
      margin: 0;
      display: flex;
      text-align: left;
    }

    .c-tile h5,
    .c-tile span {
      font-size: 1rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .c-tile h5 {
      color: #d9bd68;
    }

    .c-tile span {
      color: #ffffff;
      display: inline-block;
      margin-left: 10px;
    }

    .c-tile .tile.is-vertical > .is-child:not(:last-child) {
      margin-bottom: 10px !important;
    }

    .c-tile .is-narrow {
      flex: none;
      text-align: right;
    }
  }
}
</style>
