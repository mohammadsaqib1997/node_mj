<template>
  <b-modal class="promotion" :active.sync="modalAct" :canCancel="['x']">
    <div class="box main-box">
      <div class="header">
        <h1>Lucky Draw Winners</h1>
      </div>
      <div class="body">
        <div class="section">
          <table class="table is-fullwidth __gp_tb">
            <thead>
              <tr>
                <th width="100">
                  <abbr title="Lucky Draw">LD</abbr> ID
                </th>
                <th>MJ ID</th>
                <th>MJ Name</th>
                <th>Product</th>
                <th>Win At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ind) in f_data" :key="ind">
                <td>{{ row.ld_id }}</td>
                <td>{{ row.user_asn_id }}</td>
                <td>{{ row.full_name }}</td>
                <td>{{ row.prd_name }}</td>
                <td>{{ frmDate(row.win_at) }}</td>
              </tr>
            </tbody>
          </table>
          <p class="control has-text-centered">
            <button class="button btn-des-1 dark" @click="modalAct=false">Close</button>
          </p>
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
  async mounted() {
    const self = this;
    await self.$axios
      .get("/api/lucky-draw/today-winners")
      .then(res => {
        if (res.data.result.length > 0) {
          self.f_data = res.data.result;
          self.$emit("load_data", true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  data() {
    return {
      f_data: []
    };
  },
  methods: {
    frmDate(str) {
      return moment(new Date(str)).format("hh:mm:ss A, DD-MM-YYYY");
    }
  }
};
</script>

<style lang="scss" scoped>
.promotion /deep/ {
  > .modal-content {
    width: 100%;
    max-width: 820px !important;
    .__gp_tb {
      font-size: 16px;
    }
  }
}
</style>