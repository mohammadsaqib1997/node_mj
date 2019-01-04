<template>
  <div>
    <h1 class="title">Regions</h1>
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
          <th>Code</th>
          <th>Area Name</th>
          <th>Total Regions</th>
          <th>Total Sale</th>
          <th>Total Commission</th>
        </tr>
      </template>
      <template slot="tbody">
        <tr v-for="(row, ind) in l_data" :key="ind">
          <td>{{ row.mj_id }}</td>
          <td>{{ row.crzb_code }}</td>
          <td>{{ row.crzb_name }}</td>
          <td>{{ row.crzb_name }}</td>
          <td>{{ row.total_month_sale }}</td>
          <td>{{ row.total_sale }}</td>
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
  data() {
    return {
      l_data: [
        {
          mj_id: 1,
          crzb_code: 1,
          crzb_name: 1,
          total_month_sale: 1,
          total_sale: 1,
        }
      ]
    }
  },
  methods: {
    loadData() {
      const self = this;
      self.loading = false;
    }
  }
};
</script>

