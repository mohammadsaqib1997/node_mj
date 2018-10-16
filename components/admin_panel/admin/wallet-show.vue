<template lang="pug">
  div
    .level.wl-top-level
      .level-left
        .wallet-cont
          | Wallet:
          span.amount Rs, {{ wallet }}/-
</template>

<script>
export default {
  async mounted() {
    this.$store.commit("admin/setLoader", true);
    await this.$store.dispatch("admin/loadWallet");
    this.$store.commit("admin/setLoader", false);
  },
  computed: {
    wallet: function() {
      return this.$store.state.admin.wallet;
    }
  }
};
</script>

<style lang="scss" scoped>
.wl-top-level {
  margin-bottom: 1.6rem;
}

.wallet-cont {
  font-size: 2.2rem;
  font-weight: 300;
  color: #454545;
  margin-bottom: 10px;
  .amount {
    margin-left: 8px;
    font-weight: 500;
  }
}
</style>


