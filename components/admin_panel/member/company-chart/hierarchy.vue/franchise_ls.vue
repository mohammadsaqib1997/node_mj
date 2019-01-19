<template>
  <div class="hr-ls" id="franchise-cont">
    <h1 class="title">Franchise Sale</h1>
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
          <th>MJ ID</th>
          <th>MJ Name</th>
          <th>Code</th>
          <th>Area Name</th>
          <th>Monthly Sale</th>
          <th>Total Sale</th>
        </tr>
      </template>
      <template slot="tbody">
        <tr v-for="(row, ind) in l_data" :key="ind">
          <td>{{ row.mj_id }}</td>
          <td>{{ row.mj_name }}</td>
          <td>{{ row.code }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.total_sale }}</td>
          <td>{{ row.month_sale }}</td>
        </tr>
      </template>
    </tableComp>
  </div>
</template>

<script>
import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import tableComp from "~/components/html_comp/tableComp.vue";
export default {
  mixins: [mxn_tableFilterListing],
  components: {
    tableComp,
    tblTopFilter
  },
  props: {
    p_hod_id: {
      required: true,
      type: Number
    }
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get(`/api/hod/sale-list/${self.p_hod_id}/4`, {
          params: self.load_params
        })
        .then(res => {
          self.l_data = res.data.data;
          self.num_rows = res.data.tot_rows;
        })
        .catch(err => {
          console.log(err);
        });
      $(".main-content").animate(
        { scrollTop: $("#franchise-cont").position().top + 370 },
        500
      );
      self.loading = false;
    }
  }
};
</script>

<style>
</style>
