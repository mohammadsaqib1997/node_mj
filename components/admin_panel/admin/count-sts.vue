<template lang="pug">
    .box.counter-box
        .columns.is-gapless.is-multiline
            .column.is-12-mobile.is-6-tablet.is-3-widescreen
                //- h1 {{ paid_mem }}
                //- h5 Paid Members
                .flex
                    div
                        .tile.is-ancestor.c-tile.is-parent
                            .tile.is-vertical.is-narrow
                                .tile.is-child
                                    h5 {{ paid_mem }}
                                .tile.is-child
                                    h5 {{ un_paid_mem }}
                            .tile.is-vertical
                                .tile.is-child
                                    span Paid Members
                                .tile.is-child
                                    span Pending Members
                                
                
            .column.is-12-mobile.is-6-tablet.is-3-widescreen
                .amount-wrapepr
                    b Rs.
                    h1 {{ wallet }}/-
                h5 Wallet
            .column.is-12-mobile.is-6-tablet.is-3-widescreen
                .flex
                  div
                    .tile.is-ancestor.c-tile.is-parent
                      .tile.is-vertical.is-narrow
                        .tile.is-child
                          h5 {{ paid_cm }}/-
                        .tile.is-child
                          h5 {{ un_paid_cm }}/-
                        .tile.is-child
                          h5 {{ user_wallet }}/-
                      .tile.is-vertical
                        .tile.is-child
                          span Paid Commissions
                        .tile.is-child
                          span Un-Paid Commissions
                        .tile.is-child
                          span User Wallet
            .column.is-12-mobile.is-6-tablet.is-3-widescreen
                .amount-wrapepr
                    b Rs.
                    h1 {{ parseInt(wallet) + parseInt(paid_cm) + parseInt(user_wallet) }}/-
                h5 Grand Total
        b-loading(:is-full-page="false" :active="loading" :can-cancel="false")
</template>

<script>
export default {
  async mounted() {
    const self = this;
    self.loading = true;
    await self.$axios
      .get("/api/admin/member_counts")
      .then(res => {
        let data = res.data.data;
        self.paid_mem = data.paid_mem ? data.paid_mem : 0;
        self.un_paid_mem = data.un_paid_mem;
      })
      .catch(err => {
        console.log(err);
      });
    await self.$axios
      .get("/api/admin/total_cm")
      .then(res => {
        self.paid_cm = res.data.paid;
        self.un_paid_cm = res.data.un_paid;
      })
      .catch(err => {
        console.log(err);
      });
    await self.$axios
      .get("/api/admin/wallet")
      .then(res => {
        self.wallet = res.data.comp_wallet;
        self.user_wallet = res.data.user_wallet;
      })
      .catch(err => {
        console.log(err);
      });
    self.loading = false;
  },
  data() {
    return {
      loading: true,
      paid_mem: 0,
      un_paid_mem: 0,
      paid_cm: 0,
      un_paid_cm: 0,
      wallet: 0,
      user_wallet: 0
    };
  }
};
</script>

<style scoped>
.box.counter-box {
  position: relative;
}

.flex {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.c-tile {
  margin: 0;
  display: flex;
  text-align: left;
}

.c-tile h5,
.c-tile span {
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
}

.c-tile h5 {
  color: #d9bd68;
}
.c-tile span {
  color: #ffffff;
  display: inline-block;
  margin-left: 10px;
}
.c-tile .tile.is-vertical > .is-child:not(:last-child) {
  margin-bottom: 10px !important;
}
.c-tile .is-narrow {
  flex: none;
  text-align: right;
}
</style>


