<template>
  <div class="main">
    <div class="box counter-box">
      <div class="columns is-gapless is-multiline">
        <div class="column is-12-mobile is-6-tablet is-4-widescreen">
          <div class="flex">
            <div>
              <div class="tile is-ancestor c-tile is-parent">
                <div class="tile is-vertical is-narrow">
                  <div class="tile is-child">
                    <h5>{{ all_sale.monthly }}</h5>
                  </div>
                  <div class="tile is-child">
                    <h5>{{ all_sale.yearly }}</h5>
                  </div>
                  <div class="tile is-child">
                    <h5>{{ all_sale.total }}</h5>
                  </div>
                </div>
                <div class="tile is-vertical">
                  <div class="tile is-child">
                    <span>Monthly Sale</span>
                  </div>
                  <div class="tile is-child">
                    <span>Yearly Sale</span>
                  </div>
                  <div class="tile is-child">
                    <span>Total Sale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-12-mobile is-6-tablet is-4-widescreen">
          <div class="flex">
            <div>
              <h5
                class="title-cus-1"
              >{{ getData(type_data, getData(hod_data, 'type', 0)+1, 'Sales Coordinator') }} Sale</h5>
              <div class="tile is-ancestor c-tile is-parent">
                <div class="tile is-vertical is-narrow">
                  <div class="tile is-child" v-for="(row, ind) in lvl_2_sale" :key="ind">
                    <h5>{{ row.sale ? row.sale : 0 }}</h5>
                  </div>
                </div>
                <div class="tile is-vertical">
                  <div class="tile is-child" v-for="(row, ind) in lvl_2_sale" :key="ind">
                    <span>{{ row.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-12-mobile is-6-tablet is-4-widescreen">
          <div class="flex">
            <div>
              <div class="amount-wrapper">
                <b>{{ getData(lvl_1_sale, 'c_name', 'Pakistan') }}</b>
                <h1>{{ getData(lvl_1_sale, 'sale', 0) }}</h1>
              </div>
              <h5 class="title-cus-2">{{ type_data[getData(lvl_1_sale, 'type', 0)] }} Sale</h5>
            </div>
          </div>
        </div>
      </div>
      <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
    </div>

    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Sales List</h1>
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
                <th>MJ ID</th>
                <th>MJ Name</th>
                <th>Code</th>
                <th>Area Name</th>
                <template v-if="hod_data.type != 3">
                  <th>Monthly Sale</th>
                  <th>Total Sale</th>
                </template>
                <template v-else>
                  <th>Join Date</th>
                </template>
              </tr>
            </template>
            <template slot="tbody">
              <tr v-for="(row, ind) in l_data" :key="ind">
                <td>{{ row.role_asn_mj_id }}</td>
                <td>{{ row.role_asn_mj_name }}</td>
                <td>{{ row.crzb_code }}</td>
                <td>{{ row.crzb_name }}</td>
                <template v-if="hod_data.type != 3">
                  <td>{{ row.total_month_sale }}</td>
                  <td>{{ row.total_sale }}</td>
                </template>
                <template v-else>
                  <td>{{ $store.getters['formatDate'](row.join_date) }}</td>
                </template>
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
  mixins: [mxn_tableFilterListing],
  components: {
    tableComp,
    tblTopFilter
  },
  computed: {
    hod_data: function() {
      return this.$store.state["crzb-module"];
    }
  },
  data() {
    return {
      all_sale: {
        total: 0,
        yearly: 0,
        monthly: 0
      },
      type_data: ["Country", "Sales Coordinator", "Zone"],
      lvl_2_sale: [
        {
          name: "SINDH",
          sale: 0
        },
        {
          name: "PUNJAB",
          sale: 0
        },
        {
          name: "BALOCHISTAN",
          sale: 0
        },
        {
          name: "KHYBER PAKHTUNKHWA",
          sale: 0
        },
        {
          name: "GILGIT BALTISTAN",
          sale: 0
        },
        {
          name: "OTHERS",
          sale: 0
        }
      ],
      lvl_1_sale: {
        type: 0,
        c_name: "Pakistan",
        sale: 0
      }
    };
  },
  methods: {
    async loadData() {
      const self = this;
      let hod_type = self.hod_data.type;
      self.loading = true;
      if (hod_type === 5) {
        await self.$axios
          .get("/api/assign-role-trans/sale-count")
          .then(res => {
            self.all_sale = {
              total: res.data.data.total_sale,
              yearly: res.data.data.yearly_sale,
              monthly: res.data.data.monthly_sale
            };
          })
          .catch(err => {
            console.log(err);
          });
        await self.$axios
          .get("/api/assign-role-trans/sale-region")
          .then(res => {
            self.lvl_2_sale = res.data.regions;
          })
          .catch(err => {
            console.log(err);
          });
        await self.$axios
          .get("/api/assign-role-trans/sale-country")
          .then(res => {
            self.lvl_1_sale = res.data.countries[0];
          })
          .catch(err => {
            console.log(err);
          });
      }
      await self.listLoad();
      self.loading = false;
    },
    async listLoad() {
      const self = this;
      let hod_type = self.hod_data.type;
      self.loading = true;
      if (hod_type === 5) {
        await self.$axios
          .get("/api/assign-role-trans/sale-list", {
            params: self.load_params
          })
          .then(res => {
            self.l_data = res.data.data;
            self.num_rows = res.data.tot_rows;
          })
          .catch(err => {
            console.log(err);
          });
      }
      self.loading = false;
    },
    getData(obj, path, def) {
      return _.get(obj, path, def);
    }
  }
};
</script>
