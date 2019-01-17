<template>
  <div class="wrapper">
    <div class="box main-box">
      <div class="header columns is-gapless is-multiline">
        <div class="column">
          <h1>Sales</h1>
        </div>
      </div>
      <div class="body">
        <div class="section">
          <div v-if="l_data.length > 0" class="columns is-variable is-4 is-multiline">
            <div v-for="(row, ind) in l_data" :key="ind" class="column is-4">
              <div class="box cust-box">
                <div class="head">
                  <p>Franchise: {{ row.name }}</p>
                  <p>Branch: {{ row.crzb_name }}</p>
                </div>
                <div class="body">
                  <h2 class="title is-3">Sale: {{ row.total_sale }}</h2>
                  <div class="level">
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">Monthly</p>
                        <p class="title">{{ row.total_month_sale }}</p>
                      </div>
                    </div>
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">Yearly</p>
                        <p class="title">{{ row.total_year_sale }}</p>
                      </div>
                    </div>
                    <div class="level-item has-text-centered">
                      <div>
                        <p class="heading">Total</p>
                        <p class="title">{{ row.total_sale }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section class="section em-sec" v-else>
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon icon="frown" pack="far" size="is-large"></b-icon>
              </p>
              <p>Nothing here.</p>
            </div>
          </section>
          <b-field v-if="l_data.length < tot_rows">
            <p class="control has-text-centered">
              <button class="button btn-des-1 dark" @click.prevent="page++;loadData();">Load More</button>
            </p>
          </b-field>
          <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  layout: "admin_layout",
  async mounted() {
    await this.loadData();
  },
  data() {
    return {
      loading: false,
      l_data: [],
      tot_rows: 0,
      page: 1
    };
  },
  methods: {
    async loadData() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/assign-role-trans-fr/sale-list", {
          params: {
            page: self.page
          }
        })
        .then(res => {
          self.l_data = _.flattenDeep([self.l_data, res.data.data]);
          self.tot_rows = res.data.tot_rows;
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  /deep/ {
    .cust-box {
      padding: 0;
      height: 100%;
      overflow: hidden;
      .head {
        word-break: break-word;
        border-bottom: 2px solid #d9bd68;
        padding: 15px;
        font-size: 18px;
        font-weight: 400;
        color: #3d3e5a;
      }
      .body {
        > .title {
          padding: 20px;
          text-align: center;
          text-transform: uppercase !important;
          font-weight: 400;
          color: #d9bd68 !important;
          background-color: #3d3e5a;
          margin-bottom: 0;
          font-family: inherit !important;
          font-size: 2rem !important;
        }
        > .level {
          padding: 15px 0;
          color: #3d3e5a;
        }
      }
    }
  }
}
</style>
