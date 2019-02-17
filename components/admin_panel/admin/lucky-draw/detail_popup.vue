<template>
  <b-modal class="pincode_verify" :active.sync="modalAct" :canCancel="['x', 'outside']">
    <div class="box main-box">
      <div class="header">
        <h1>Lucky Draw Winner Detail</h1>
      </div>
      <div class="body">
        <div class="section">
          <table class="table is-narrow is-fullwidth __gp_tb">
            <thead>
              <tr>
                <th class="has-text-centered" colspan="5">
                  <abbr title="Lucky Draw">LD</abbr>
                  ID-{{ winner_d.grp_id }}
                </th>
              </tr>
              <tr>
                <th width="100">
                  <abbr title="Lucky Draw">LD</abbr> Serial#
                </th>
                <th>MJ ID</th>
                <th>MJ Name</th>
                <th>
                  <abbr title="Link Member">LM</abbr> ID
                </th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ind) in data_f" :key="ind">
                <td>{{ ind+1 }}</td>
                <td>{{ row.user_asn_id }}</td>
                <td>{{ row.full_name }}</td>
                <td>{{ row.lnk_mem_id }}</td>
                <td>{{ frmDate(row.created_at) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="has-text-centered" colspan="5">
                  <p class="has-text-success">Lucky Draw Winner: {{winner_d.mj_id}}</p>
                </td>
              </tr>
            </tfoot>
          </table>
          <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import mxn_modal from "~/mixins/modal.js";
import moment from "moment";
export default {
  mixins: [mxn_modal],
  props: {
    load_ld_grp: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      data_f: [],
      winner_d: {}
    };
  },
  methods: {
    frmDate(str) {
      return moment(new Date(str)).format("hh:mm:ss A, DD-MM-YYYY");
    },
    async loadData() {
      const self = this;
      if (self.load_ld_grp !== null) {
        self.loading = true;
        await self.$axios
          .get(`/api/lucky-draw/ld-detail/${self.load_ld_grp}`)
          .then(res => {
            self.data_f = res.data.data;
            self.winner_d = res.data.winner;
          })
          .catch(err => {
            console.log(err);
          });
        self.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.section {
  min-height: 200px;
}
</style>

