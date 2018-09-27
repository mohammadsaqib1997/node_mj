<template lang="pug">
    .fund-details
        walletShow
        .box.main-box
            .header.columns.is-gapless
                .column
                    h1 Bank Details
            .body
                .section
                    .columns.is-gapless
                        .column.is-8
                            bankDetComp
</template>

<script>
import walletShow from "~/components/admin_panel/member/wallet-show.vue";
import bankDetComp from '~/components/admin_panel/member/bank-detail-sec.vue'
export default {
  layout: "admin_layout",
  components: {
    walletShow,
    bankDetComp
  },
  data() {
    return {

    };
  },
};
</script>

<style lang="sass" scoped>
</style>
