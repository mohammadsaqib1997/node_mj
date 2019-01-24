<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header">
        <h1>Rewards Request</h1>
      </div>
      <div class="body">
        <div class="section">
          <tblTopFilter
            :f_list="tbl_list_filters"
            @change_filter="change_filter_tr($event)"
            :filter_set="filter_val"
            :act_view="load_params.limit"
            :s_txt="load_params.search"
            @change_act_view="update_params('limit', $event)"
            @change_s_txt="update_params('search', $event)"
          ></tblTopFilter>
          <tableComp
            :arr="l_data"
            :loading="loading"
            :total_record="num_rows"
            :per_page="parseInt(load_params.limit)"
            :page_set="load_params.page"
            @page_change="update_params('page', $event)"
          >
            <template slot="thead">
              <tr>
                <th>ID</th>
                <th>Member ID</th>
                <th>Member Email</th>
                <th>Reward Type</th>
                <th>Level</th>
                <th>Selected Reward</th>
                <th>Action</th>
              </tr>
            </template>
            <template slot="tbody">
              <tr v-for="(row, ind) in l_data" :key="ind">
                <td>{{ row.id }}</td>
                <td>{{ row.user_asn_id }}</td>
                <td>{{ row.email }}</td>
                <td>{{ row.type == 1 ? 'Self Reward':'Auto Reward' }}</td>
                <td>{{ getLvlRwd(row.type, row.level, 'lvl') }}</td>
                <td>{{ getLvlRwd(row.type, row.level, 'rwds.['+row.reward_selected+']') }}</td>
                <td>
                  <b-field grouped>
                    <p class="control">
                      <button
                        class="button is-small is-info"
                        @click.prevent="approveRwd(row.id)"
                      >Approve</button>
                    </p>
                    <p class="control">
                      <button
                        class="button is-small is-danger"
                        @click.prevent="md_act=true;clm_sel_id=row.id"
                      >Cancel</button>
                    </p>
                  </b-field>
                </td>
              </tr>
            </template>
          </tableComp>
        </div>
      </div>
    </div>
    <modelCancelRwd
      :md_act="md_act"
      :clm_id="clm_sel_id"
      @closed="md_act=false;rwd_sel_id=null"
      @updated="loadData"
    ></modelCancelRwd>
  </div>
</template>

<script>
import tableComp from "~/components/html_comp/tableComp.vue";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import modelCancelRwd from "~/components/modals/cancel_reward.vue";

import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";
import mxn_rewardsData from "~/mixins/rewards-data.js";
export default {
  layout: "admin_layout",
  mixins: [mxn_tableFilterListing, mxn_rewardsData],
  components: {
    tableComp,
    tblTopFilter,
    modelCancelRwd
  },
  data() {
    return {
      md_act: false,
      clm_sel_id: null,
      tbl_list_filters: [
        { title: "Filter", value: "" },
        { title: "Auto Rewards", value: "auto" },
        { title: "Level You", value: 0 },
        { title: "Level 1", value: 1 },
        { title: "Level 2", value: 2 },
        { title: "Level 3", value: 3 },
        { title: "Level 4", value: 4 },
        { title: "Level 5", value: 5 },
        { title: "Level 6", value: 6 },
        { title: "Level 7", value: 7 },
        { title: "Level 8", value: 8 },
        { title: "Level 9", value: 9 }
      ]
    };
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/reward/list_req", {
          params: self.load_params
        })
        .then(res => {
          self.num_rows = res.data.total_rows;
          self.l_data = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    },
    async approveRwd(id) {
      const self = this;
      self.loading = true;
      await self.$axios
        .post("/api/reward/sts_change", {
          clm_id: id,
          sts: 1
        })
        .then(async res => {
          self.$toast.open({
            duration: 3000,
            message: "Successfully Approve Reward Request.",
            position: "is-bottom",
            type: "is-success"
          });
          await self.loadData();
        })
        .catch(err => {
          console.log(err);
          self.$toast.open({
            duration: 3000,
            message: "Server Error! " + err.message,
            position: "is-bottom",
            type: "is-danger"
          });
        });
      self.loading = false;
    }
  }
};
</script>