<template>
  <b-modal class="add_pincode" :active.sync="modalAct" :canCancel="['outside']">
    <div class="box main-box">
      <div class="header">
        <h1>Add Secondary PinCode</h1>
      </div>
      <div class="body">
        <div class="section">

          <b-loading :is-full-page="false" :active="loading" :can-cancel="false"></b-loading>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import mxn_modal from "~/mixins/modal.js";
export default {
  mixins: [mxn_modal],
  data() {
    return {
      loading: true
    };
  },
  methods: {
    async loadData() {
      // const self = this;
      // self.loading = true;
      // await self.$axios
      //   .get("/api/member/member_info/" + self.mem_id)
      //   .then(res => {
      //     self.mem_info = res.data.result;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      // self.loading = false;
    },
    
  }
};
</script>

<style lang="scss" scoped>
.add_pincode /deep/ {
  .section {
    min-height: 200px;

    

    .btns-cont {
      justify-content: center;
      & > .btn-des-1:not(:last-child) {
        margin-right: 1rem;
      }
    }
  }
}
</style>