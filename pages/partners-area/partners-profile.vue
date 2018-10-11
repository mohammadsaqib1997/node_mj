<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header">
        <h1>Partners Profile</h1>
      </div>
      <div class="body">
        <div class="section">
          <tbl-top-filter :act_view="load_params.limit" :s_txt="load_params.search" @change_act_view="update_params('limit', $event)"
            @change_s_txt="update_params('search', $event)"></tbl-top-filter>
          <table-comp :arr="l_data" :loading="loading" :total_record="num_rows" :per_page="parseInt(load_params.limit)"
            :page_set="load_params.page" @page_change="update_params('page', $event)">
            <template slot="thead">
              <tr>
                <th width="50px"></th>
                <th>ID</th>
                <th>Date</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>City</th>
              </tr>
            </template>
            <template slot="tbody">
              <tr v-for="(row, ind) in l_data" :key="ind">
                <td class="ed-con">
                  <button class="button ed-btn" @click.prevent="ed_md_act=true;ed_md_id=row.id">
                    <b-icon icon="edit"></b-icon>
                    &nbsp;&nbsp;&nbsp;EDIT
                  </button>
                </td>
                <td>{{ row.id }}</td>
                <td>{{ $store.getters['formatDate'](row.created_at) }}</td>
                <td>{{ row.full_name }}</td>
                <td>{{ row.email }}</td>
                <td>{{ row.city }}</td>
              </tr>
            </template>
          </table-comp>
        </div>
      </div>
    </div>
    <edPartner :md_act="ed_md_act" :id="ed_md_id" @closed="ed_md_act=false;ed_md_id=null;" @updated="loadData"></edPartner>
  </div>
</template>

<script>
import tableComp from "~/components/html_comp/tableComp.vue";
import tblTopFilter from "~/components/html_comp/tableTopFilter.vue";
import edPartner from "~/components/modals/ed_partner.vue";
import mxn_tableFilterListing from "~/mixins/table_filter_listing.js";
export default {
  layout: "admin_layout",
  mixins: [mxn_tableFilterListing],
  components: {
    tableComp,
    tblTopFilter,
    edPartner
  },
  data() {
    return {
      ed_md_act: false,
      ed_md_id: null
    };
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const result = await this.$axios.$get("/api/partner/list", {
          params: this.load_params
        });
        this.num_rows = result.total_rows;
        this.l_data = result.data;
      } catch (err) {
        console.log(err);
      }

      this.loading = false;
    }
  }
};
</script>