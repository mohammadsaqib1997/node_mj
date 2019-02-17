<template>
  <div class="columns">
    <div class="column is-12">
      <tblTopFilter
        :act_view="load_params.limit"
        :s_txt="load_params.search"
        @change_act_view="update_params('limit', $event)"
        @change_s_txt="update_params('search', $event)"
      />
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
            <th>
              <abbr title="Lucky Draw">LD</abbr> ID
            </th>
            <th>MJ ID</th>
            <th>MJ Name</th>
            <th>Product</th>
            <th>Win At</th>
            <th>Detail</th>
          </tr>
        </template>
        <template slot="tbody">
          <tr v-for="(row, ind) in l_data" :key="ind">
            <td>{{row.group}}</td>
            <td>{{row.user_asn_id}}</td>
            <td>{{row.full_name}}</td>
            <td>{{row.prd_name}}</td>
            <td>{{ frmDate(row.created_at) }}</td>
            <td>
              <button class="button is-small is-info" @click="det_act=true;det_id=row.id">View</button>
            </td>
          </tr>
        </template>
      </tableComp>
    </div>
    <detPopup :md_act="det_act" :load_ld_grp="det_id" @closed="det_act=false;det_id=null"/>
  </div>
</template>

<script>
import moment from "moment";
import tableComp from "~/components/html_comp/tableComp.vue";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";
import detPopup from "~/components/admin_panel/admin/lucky-draw/detail_popup.vue";

export default {
  mixins: [mxn_tableFilterListing],
  props: {
    load: {
      type: Boolean,
      default: false
    }
  },
  components: {
    tableComp,
    tblTopFilter,
    detPopup
  },
  async mounted() {
    const self = this;
    if (self.load === true) {
      self.loading = true;
      await self.data_load();
      self.loading = false;
    }
  },
  watch: {
    load: async function(val) {
      const self = this;
      if (val === true) {
        self.loading = true;
        await self.data_load();
        self.loading = false;
      } else {
        // self.l_data = [];
        self.resetParams();
      }
    }
  },
  data() {
    return {
      det_act: false,
      det_id: null
    };
  },
  methods: {
    async loadData() {
      const self = this;
      if (self.load === true) {
        self.loading = true;
        await self.data_load();
        self.loading = false;
      }
    },
    async data_load() {
      const self = this;
      await self.$axios
        .get("/api/lucky-draw/winner-list", {
          params: self.load_params
        })
        .then(res => {
          self.l_data = res.data.data;
          self.num_rows = res.data.tot_rows;
        })
        .catch(err => {
          console.log(err);
        });
    },
    frmDate(str) {
      return moment(new Date(str)).format("hh:mm:ss A, DD-MM-YYYY");
    }
  }
};
</script>

<style lang="scss" scoped>
.columns {
  position: relative;
}
</style>

