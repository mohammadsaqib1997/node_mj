<template>
  <b-modal class="promotion" :active.sync="modalAct" :canCancel="['x']">
    <mdContent></mdContent>
  </b-modal>
</template>

<script>
import mxn_modal from "~/mixins/modal.js";
import mdContent from "~/components/modals/promotions/mega_pm_20jan_31mar.vue";
export default {
  mixins: [mxn_modal],
  components: {
    mdContent
  }
};
</script>

<style lang="scss" scoped>
.promotion /deep/ {
  > .modal-content {
    width: 100%;
    max-width: 820px !important;
  }
}
</style>