<template>
  <div>
    <h1 class="title">Zones</h1>
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
          <th>Total Sales</th>
          <th>Monthly Sales</th>
          <th>Total Commission</th>
          <th>Monthly Commission</th>
        </tr>
      </template>
      <template slot="tbody">
        <tr v-for="(row, ind) in l_data" :key="ind" @click.prevent="nextChild(row.crzb_id)">
          <td>{{ row.user_asn_id }}</td>
          <td>{{ row.full_name }}</td>
          <td>{{ row.crzb_code }}</td>
          <td>{{ row.crzb_name }}</td>
          <td>{{ row.total_sale }}</td>
          <td>{{ row.monthly_sale }}</td>
          <td>{{ row.total_comm }}</td>
          <td>{{ row.monthly_comm }}</td>
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
    parent_id: {
      required: true,
      type: Number
    }
  },
  watch: {
    parent_id(val) {
      if (val !== null) {
        this.resetParams();
        this.loadData();
      }
    }
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get(`/api/company-hierarchy/crzb-list/2/${self.parent_id}`, {
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
        { scrollTop: $("#zone-cont").position().top },
        500
      );
      self.loading = false;
    },
    nextChild(crzb_id) {
      this.$emit("load_child", crzb_id);
    }
  }
};
</script>

