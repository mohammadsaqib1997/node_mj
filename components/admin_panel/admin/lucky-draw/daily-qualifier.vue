<template>
  <div class="columns">
    <div class="column is-12 is-6-desktop">
      <!-- SIDC Card -->
      <h1 class="title is-4 has-text-centered">SIDC Card</h1>
      <template v-if="prd_1.length > 0">
        <template v-for="(grp, g_ind) in prd_1">
          <table class="table is-fullwidth __gp_tb" :key="g_ind">
            <thead>
              <tr>
                <th class="has-text-centered" colspan="5">
                  <abbr title="Lucky Draw">LD</abbr>
                  ID-{{ grp.group }}
                </th>
              </tr>
              <tr>
                <th width="100">
                  <abbr title="Lucky Draw">LD</abbr> Serial#
                </th>
                <th width="150">Paid At</th>
                <th>MJ ID</th>
                <th>MJ Name</th>
                <th>
                  <abbr title="Link Member">LM</abbr> ID
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ind) in grp.data" :key="ind">
                <td>{{ ind+1 }}</td>
                <td>{{ $store.getters['formatDate'](row.paid_at) }}</td>
                <td>{{ row.user_asn_id }}</td>
                <td>{{ row.full_name }}</td>
                <td>{{ row.lnk_mem_id }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="has-text-centered" colspan="5">
                  <button
                    class="button btn-des-1"
                    v-if="checkIsSpin('prd_1', g_ind)"
                    @click.prevent="submitSpin(1, grp.group)"
                  >Spin</button>
                  <p class="has-text-grey" v-else>Wait for completing group members.</p>
                </td>
              </tr>
            </tfoot>
          </table>
        </template>
        <b-field v-if="has_prds_1" class="has-text-centered">
          <button class="button is-small btn-des-2" @click.prevent="load_prd_1()">Load More</button>
        </b-field>
      </template>
      <section class="section" v-else>
        <div class="content has-text-centered has-text-grey">
          <p>
            <b-icon icon="frown" pack="far" size="is-large"></b-icon>
          </p>
          <p>Nothing here.</p>
        </div>
      </section>
    </div>
    <div class="column is-12 is-6-desktop">
      <!-- SIDC + Insurance Card -->
      <h1 class="title is-4 has-text-centered">SIDC + Insurance Card</h1>
      <template v-if="prd_2.length > 0">
        <template v-for="(grp, g_ind) in prd_2">
          <table class="table is-fullwidth __gp_tb" :key="g_ind">
            <thead>
              <tr>
                <th class="has-text-centered" colspan="5">
                  <abbr title="Lucky Draw">LD</abbr>
                  ID-{{ grp.group }}
                </th>
              </tr>
              <tr>
                <th width="100">
                  <abbr title="Lucky Draw">LD</abbr> Serial#
                </th>
                <th width="150">Paid At</th>
                <th>MJ ID</th>
                <th>MJ Name</th>
                <th>
                  <abbr title="Link Member">LM</abbr> ID
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ind) in grp.data" :key="ind">
                <td>{{ ind+1 }}</td>
                <td>{{ $store.getters['formatDate'](row.paid_at) }}</td>
                <td>{{ row.user_asn_id }}</td>
                <td>{{ row.full_name }}</td>
                <td>{{ row.lnk_mem_id }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="has-text-centered" colspan="5">
                  <button
                    class="button btn-des-1"
                    v-if="checkIsSpin('prd_2', g_ind)"
                    @click.prevent="submitSpin(2, grp.group)"
                  >Spin</button>
                  <p class="has-text-grey" v-else>Wait for completing group members.</p>
                  <!-- <p class="__win_content" v-if="grp_win">Group Winner: 000000001</p> -->
                </td>
              </tr>
            </tfoot>
          </table>
        </template>
        <b-field v-if="has_prds_2" class="has-text-centered">
          <button class="button is-small btn-des-2" @click.prevent="load_prd_2()">Load More</button>
        </b-field>
      </template>
      <section class="section" v-else>
        <div class="content has-text-centered has-text-grey">
          <p>
            <b-icon icon="frown" pack="far" size="is-large"></b-icon>
          </p>
          <p>Nothing here.</p>
        </div>
      </section>
    </div>
    <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  props: {
    load: {
      type: Boolean,
      default: false
    }
  },
  async mounted() {
    const self = this;
    if (self.load === true) {
      self.loading = true;
      await self.load_prd_1();
      await self.load_prd_2();
      self.loading = false;
    }
  },
  watch: {
    load: async function(val) {
      const self = this;
      if (val === true) {
        self.loading = true;
        await self.load_prd_1();
        await self.load_prd_2();
        self.loading = false;
      } else {
        self.prd_1 = [];
        self.prd_2 = [];
        self.prd1_params.offset = 0;
        self.prd2_params.offset = 0;
        self.has_prds_1 = false;
        self.has_prds_2 = false;
      }
    }
  },
  data() {
    return {
      loading: false,
      prd_1: [],
      prd_2: [],
      has_prds_1: false,
      has_prds_2: false,
      prd1_params: {
        offset: 0
      },
      prd2_params: {
        offset: 0
      }
    };
  },
  methods: {
    async load_prd_1() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/lucky-draw/ld-list/1", {
          params: self.prd1_params
        })
        .then(res => {
          self.prd_1 = _.flattenDeep([self.prd_1, res.data.data]);
          self.has_prds_1 = res.data.last_offset < res.data.tot_rows;
          self.prd1_params.offset = res.data.last_offset;
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    },
    async load_prd_2() {
      const self = this;
      self.loading = true;
      await self.$axios
        .get("/api/lucky-draw/ld-list/2", {
          params: self.prd2_params
        })
        .then(res => {
          self.prd_2 = _.flattenDeep([self.prd_2, res.data.data]);
          self.has_prds_2 = res.data.last_offset < res.data.tot_rows;
          self.prd2_params.offset = res.data.last_offset;
        })
        .catch(err => {
          console.log(err);
        });
      self.loading = false;
    },
    checkIsSpin(prd_sel, ind) {
      let grp_data = _.get(this, `${prd_sel}[${ind}].data`, []);
      if (grp_data.length === 5) {
        return true;
      }
      return false;
    },
    async submitSpin(prd, grp_pg) {
      const self = this;
      self.loading = true;
      await self.$axios
        .post(`/api/lucky-draw/spin/${prd}/${grp_pg}`)
        .then(async res => {
          if (res.data.status === false) {
            self.$toast.open({
              duration: 1000,
              message: res.data.message,
              position: "is-bottom",
              type: "is-danger"
            });
          } else {
            self.$toast.open({
              duration: 1000,
              message: "Successfully Winner Announced!",
              position: "is-bottom",
              type: "is-success"
            });
            if (prd === 1) {
              self.prd_1 = [];
              self.prd1_params.offset = 0;
              self.has_prds_2 = false;
              await self.load_prd_1();
            } else if (prd === 2) {
              self.prd_2 = [];
              self.prd2_params.offset = 0;
              self.has_prds_2 = false;
              await self.load_prd_2();
            }
          }
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
.columns {
  position: relative;
}
</style>
