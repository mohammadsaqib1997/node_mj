<template>
  <b-modal class="promotion" :active.sync="modalAct" :canCancel="['x']">
    <mdContent></mdContent>
  </b-modal>
</template>

<script>
import mxn_modal from "~/mixins/modal.js";
import mdContent from "~/components/modals/promotions/new_price.vue";
export default {
  mixins: [mxn_modal],
  components: {
    mdContent
  }
};
</script>

<style lang="scss" scoped>
.promotion /deep/ {
  .modal-content {
    width: 820px;
    max-width: 100% !important;
  }
}
</style>