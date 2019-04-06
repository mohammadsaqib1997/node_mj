<template lang="pug">
    div
        .level.wl-top-level
            .level-left
              .level-item
                .wallet-cont
                    | Shopping Wallet:
                    span.amount Rs, {{ $store.state.member.wallet }}/-
            // .level-right
            //   .level-item
            //     .wallet-cont
            //         | Wallet:
            //         span.amount Rs, 0/-
            //- .level-right
            //-     button.button.tr-btn(@click.prevent="trnsModalAct = true") Transfer Funds
            //-     nuxt-link.button.wd-btn(to="/withdraw") Withdraw
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch("member/loadWallet");
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


