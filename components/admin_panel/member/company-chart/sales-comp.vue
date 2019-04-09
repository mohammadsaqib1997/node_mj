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
                <b>{{ getData(lvl_1_sale, 'c_name', 'Others') }}</b>
                <h1>{{ getData(lvl_1_sale, 'sale', 0) }}</h1>
              </div>
              <h5
                class="title-cus-2"
              >{{ getData(type_data, getData(hod_data, 'type', 0), null) }} Sale</h5>
            </div>
          </div>
        </div>
      </div>
      <b-loading :is-full-page="false" :active="toploading" :can-cancel="false"></b-loading>
    </div>
    <hierarchy></hierarchy>
  </div>
</template>

<script>
import _ from "lodash";
import hierarchy from "~/components/admin_panel/member/company-chart/hierarchy.vue/index.vue";
export default {
  components: {
    hierarchy
  },
  computed: {
    hod_data: function() {
      return this.$store.state["crzb-module"];
    }
  },
  async mounted() {
    await this.loadData();
  },
  data() {
    return {
      toploading: false,
      all_sale: {
        total: 0,
        yearly: 0,
        monthly: 0
      },
      lvl_2_sale: [
        {
          name: "OTHERS",
          sale: 0
        }
      ],
      lvl_1_sale: {},
      type_data: ["Country", "Sales Coordinator", "Zone", "Branch"]
    };
  },
  methods: {
    async loadData() {
      const self = this;
      self.toploading = true;
      await self.$axios
        .get(`/api/hod/sale-count/${self.hod_data.hod_id}`)
        .then(res => {
          self.all_sale = {
            total: res.data.data.total_sale,
            yearly: res.data.data.yearly_sale,
            monthly: res.data.data.monthly_sale
          };
          self.lvl_1_sale = {
            type: res.data.data.type,
            c_name: res.data.data.name,
            sale: res.data.data.total_sale
          };
        })
        .catch(err => {
          console.log(err);
        });
      if (self.hod_data.type === 3) {
        await self.$axios
          .get(`/api/hod/top5-branch-childs-sale/${self.hod_data.hod_id}`)
          .then(res => {
            if (res.data.data.length > 0) {
              self.lvl_2_sale = res.data.data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else if (self.hod_data.type != 3) {
        await self.$axios
          .get(`/api/hod/top5-childs-sale/${self.hod_data.hod_id}`)
          .then(res => {
            if (res.data.data.length > 0) {
              self.lvl_2_sale = res.data.data;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      self.toploading = false;
    },
    getData(obj, path, def) {
      return _.get(obj, path, def);
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  /deep/ {
    h1.title {
      font-family: serif;
      font-size: 1.5rem;
      color: #454545;
      text-transform: uppercase;
      font-weight: 100;
      margin-bottom: 1rem;
    }
    .main-box > .body > .section > hr {
      background-color: #d9bd68;
    }
  }
}
</style>

